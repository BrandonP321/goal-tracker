import { DefaultReqErrors, getReqErrWithDefaults, UserRequestErrors } from "..";
import { TFormFieldErrors } from "../../../utils/FormUtils";
import { TGoalCreationFieldId } from "../../../utils/GoalUtils";
import { HttpStatusCode } from "../HttpStatusCodes";

export const CreateGoalReqErrorCodes = {
	InvalidFieldInput: "InvalidFieldInput"
} as const;

export const CreateGoalErrors = {
	...DefaultReqErrors,
	...UserRequestErrors,
	[CreateGoalReqErrorCodes.InvalidFieldInput]: (params: {
		invalidFields: TFormFieldErrors<TGoalCreationFieldId>
	}) => getReqErrWithDefaults({ status: HttpStatusCode.BadRequest, errCode: CreateGoalReqErrorCodes.InvalidFieldInput }, params),
} as const;

export const GetUserGoalsReqErrorCodes = {  } as const;

export const GetUserGoalsErrors = {
	...DefaultReqErrors,
	...UserRequestErrors,
} as const;