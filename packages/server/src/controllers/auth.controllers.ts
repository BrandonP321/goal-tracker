import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";
import { RegisterUserRequest, ReqUserRegisterErrors } from "@goal-tracker/shared/src/api/Requests/Auth";
import { AuthUtils } from "@goal-tracker/shared/src/utils/AuthUtils";
import { JWTUtils } from "~Utils/JWTUtils";
import { TRouteController } from ".";
import { ControllerUtils } from "~Utils/ControllerUtils";
import { CallbackError } from "mongoose";
import { TUserDocSaveErr } from "~Models/User/userHelpers";
import db from "~Models";

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

		/** JSON web tokens */
		const tokens = JWTUtils.generateTokens(user.id, newTokenHash);

		if (!tokens) {
			return ControllerUtils.respondWithUnexpectedErr(res, "Unable to generate auth tokens to create new user")
		}

		JWTUtils.generateTokenCookies(tokens, res);

		const userJSON = await user.toShallowJSON();

		return res.json(userJSON).end();
	})
}