import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";
import { GetFullUserRequest, GetFullUserErrors } from "@goal-tracker/shared/src/api/Requests/User";
import { JWTResLocals } from "~Utils/JWTUtils";
import { TRouteController } from ".";
import { ControllerUtils } from "~Utils/ControllerUtils";
import db from "~Models";
import { TUserDocLocals } from "~Middleware/GetUser.middleware";

/** Returns full user JSON without sensitive data */
export const GetFullUserController: TRouteController<GetFullUserRequest.TRequest, TUserDocLocals> = async (req, res) => {
	return res.json(await res.locals.user.toFullJSON()).end();
}