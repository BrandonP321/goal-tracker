import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";
import { TAPIRequest } from "@goal-tracker/shared/src/api/Requests";
import { TRouteController } from "~Controllers/index";
import { JWTResLocals } from "~Utils/JWTUtils";
import db from "~Models";
import { UserRequestErrors } from "@goal-tracker/shared/src/api/Requests";
import { ControllerUtils } from "~Utils/ControllerUtils";

export type TUserDocLocals = JWTResLocals & {
	user: UserModel.Document;
}

/**
 * Finds user document and saves it as a response local variable.  MUST be preceded 
 * by AuthJWT() middleware, which gets the user's id from auth tokens
 */
export const GetUserMiddleware: TRouteController<TAPIRequest<{}, {}, {}>, TUserDocLocals> = async (req, res, next) => {
	try {
		const user = await db.User.findById(res.locals.userId);
	
		if (user) {
			res.locals.user = user;
			next();
		} else {
			return ControllerUtils.respondWithErr(UserRequestErrors.UserNotFound({}), res);
		}
	} catch(err) {
		return ControllerUtils.respondWithUnexpectedErr(res, "Error getting user");
	}
}