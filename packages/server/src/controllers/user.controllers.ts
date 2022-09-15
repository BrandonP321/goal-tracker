import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";
import { GetFullUserRequest, GetFullUserErrors } from "@goal-tracker/shared/src/api/Requests/User";
import { JWTResLocals } from "~Utils/JWTUtils";
import { TRouteController } from ".";
import { ControllerUtils } from "~Utils/ControllerUtils";
import db from "~Models";

export const GetFullUserController: TRouteController<GetFullUserRequest.TRequest, JWTResLocals> = async (req, res) => {
	const user = await db.User.findById(res.locals.user?.id);

	if (user) {
		return res.json(await user.toFullJSON()).end();
	} else {
		return ControllerUtils.respondWithErr(GetFullUserErrors.UserNotFound({}), res);
	}
}