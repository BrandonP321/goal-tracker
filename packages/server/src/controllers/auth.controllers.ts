import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";
import { AuthStatusRequest, LoginUserRequest, RegisterUserRequest, ReqUserLoginErrors, ReqUserRegisterErrors, SignoutUserRequest } from "@goal-tracker/shared/src/api/Requests/Auth";
import { AuthUtils } from "@goal-tracker/shared/src/utils/AuthUtils";
import { JWTResLocals, JWTUtils } from "~Utils/JWTUtils";
import { TRouteController } from ".";
import { ControllerUtils } from "~Utils/ControllerUtils";
import { CallbackError } from "mongoose";
import { TUserDocSaveErr } from "~Models/User/userHelpers";
import db from "~Models";
import { TUserDocLocals } from "~Middleware/GetUser.middleware";

export const RegisterUserController: TRouteController<RegisterUserRequest.TRequest, {}> = async (req, res) => {
	const inputValidationErrors = AuthUtils.ValidateRegistrationFields(req.body);

	if (Object.keys(inputValidationErrors).length > 0) {
		return ControllerUtils.respondWithErr(ReqUserRegisterErrors.InvalidFieldInput({ invalidFields: inputValidationErrors }), res)
	}

	/** Hash used as identifier to enforce single use of refresh tokens */
	const newTokenHash = await JWTUtils.generateHash();

	const newUser: Pick<UserModel.User, "email" | "jwtHash" | "password" | "username"> = {
		email: req.body.email,
		password: req.body.password,
		username: req.body.username,
		jwtHash: { [newTokenHash]: true }
	}

	db.User.create(newUser, async (err: CallbackError | TUserDocSaveErr, user) => {
		if (err && !(err instanceof global.Error) && err.reason) {
			switch (err.reason) {
				case "emailOrUsernameTaken":
					if (err.duplicateKey) {
						return ControllerUtils.respondWithErr(ReqUserRegisterErrors.EmailOrUsernameTaken({credentialTaken: err.duplicateKey}), res);
					}
				default:
					return ControllerUtils.respondWithUnexpectedErr(res, "Unable to create new user")
			}
		} else if (err) {
			// else some unexpected error prevent user doc from being created
			return ControllerUtils.respondWithUnexpectedErr(res, "Unable to create new user");
		}

		// generate auth tokens and set them in response header
		const { tokens } = await JWTUtils.generateAndSetTokens(user.id, res, newTokenHash);

		if (!tokens) {
			return ControllerUtils.respondWithUnexpectedErr(res, "Unable to generate auth tokens to create new user")
		}

		const userJSON = await user.toShallowJSON();

		return res.json(userJSON).end();
	})
}

export const LoginUserController: TRouteController<LoginUserRequest.TRequest, {}> = async (req, res) => {
	const inputValidationErrors = AuthUtils.ValidateLoginFields(req.body);

	if (Object.keys(inputValidationErrors).length > 0) {
		return ControllerUtils.respondWithErr(ReqUserLoginErrors.InvalidFieldInput({ invalidFields: inputValidationErrors }), res);
	}

	db.User.findOne({ email: req.body.email }, async (err: CallbackError, user: UserModel.Document) => {
		if (err || !user) {
			return ControllerUtils.respondWithErr(ReqUserLoginErrors.IncorrectEmailOrPassword({}), res);
		}

		const isValidPassword = await user.validatePassword(req.body.password);

		if (!isValidPassword) {
			return ControllerUtils.respondWithErr(ReqUserLoginErrors.IncorrectEmailOrPassword({}), res);
		}

		// generate and set auth tokens in response header
		const { tokenHashId, tokens } = await JWTUtils.generateAndSetTokens(user.id, res);

		if (!tokens) {
			return ControllerUtils.respondWithUnexpectedErr(res, "Unable to generate auth tokens to login")
		}

		// add jwt id to user's doc in db
		await user.addJWTHash(tokenHashId);

		const userJSON = await user.toShallowJSON();

		return res.json(userJSON).end();
	})
}

/** Signs user out of all devices by invalidating all refresh tokens */
export const SignoutUserController: TRouteController<SignoutUserRequest.TRequest, TUserDocLocals> = async (req, res) => {
	try {
		const user = res.locals.user;
	
		user.jwtHash = {};
		user.markModified("jwtHash");
		await user.save();

		res.json({}).end();
	} catch (err) {
		// if error occurred still send error code to client, but it is safe to still consider the user logged out at this point
		return ControllerUtils.respondWithUnexpectedErr(res);
	}
}

/** Checks the auth status of the user */
export const AuthStatusController: TRouteController<AuthStatusRequest.TRequest, JWTResLocals> = async (req, res) => {
	// if this controller is being executed, we know the user was authenticated by the auth middleware
	res.json({}).end();
}