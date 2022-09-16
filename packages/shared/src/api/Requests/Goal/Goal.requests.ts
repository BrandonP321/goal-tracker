import { TAPIRequest, TRequestErrors, TRequestErrResponse } from "..";
import { TFilledFormFields } from "../../../utils/FormUtils";
import { TGoal, TGoalCategory, TGoalCreationFieldId } from "../../../utils/GoalUtils";
import { TRouteUrlParams } from "../../routes";
import { CreateGoalErrors } from "./GoalRequestErrors";

type TGoalCreationFields = Pick<TGoal, "category" | "title" | "notes">

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
