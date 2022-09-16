import { TAPIRequest, TRequestErrors, TRequestErrResponse } from "..";
import { TFilledFormFields } from "../../../utils/FormUtils";
import { TGoal, TGoalCategory, TGoalCreationFieldId } from "../../../utils/GoalUtils";
import { UserModel } from "../../models/User.model";
import { TRouteUrlParams } from "../../routes";
import { CreateGoalErrors, GetUserGoalsErrors } from "./GoalRequestErrors";

export namespace CreateGoalRequest {
	export type TUrlParams = TRouteUrlParams<"", "">;
	export type TReqBody = TFilledFormFields<TGoalCreationFieldId> & {
		category: TGoalCategory
	}
	export type TResBody = TGoal;

	export type TRequest = TAPIRequest<TUrlParams, TReqBody, TResBody>;

	export type ErrResponse = TRequestErrResponse<typeof CreateGoalErrors>;
	export type Errors = TRequestErrors<typeof CreateGoalErrors>;
}

export namespace GetUserGoalsRequest {
	export type TUrlParams = TRouteUrlParams<"", "">;
	export type TReqBody = {};
	export type TResBody = UserModel.User["goals"];

	export type TRequest = TAPIRequest<TUrlParams, TReqBody, TResBody>;

	export type ErrResponse = TRequestErrResponse<typeof GetUserGoalsErrors>;
	export type Errors = TRequestErrors<typeof GetUserGoalsErrors>;
}