import { DefaultReqErrors, getReqErrWithDefaults, UserRequestErrors } from "..";
import { TFormFieldErrors } from "../../../utils/FormUtils";
import { TGoalCreationFieldId, TGoalUpdateFieldId } from "../../../utils/GoalUtils";
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

export const UpdateGoalReqErrorCodes = {
	InvalidFieldInput: "InvalidFieldInput",
	GoalNotFound: "GoalNotFound",
	MissingGoalIdOrCategory: "MissingGoalIdOrCategory"
} as const;

export const UpdateGoalErrors = {
	...DefaultReqErrors,
	...UserRequestErrors,
	[UpdateGoalReqErrorCodes.InvalidFieldInput]: (params: {
		invalidFields: TFormFieldErrors<TGoalUpdateFieldId>
	}) => getReqErrWithDefaults({ status: HttpStatusCode.BadRequest, errCode: UpdateGoalReqErrorCodes.InvalidFieldInput }, params),
	[UpdateGoalReqErrorCodes.GoalNotFound]: (params: {}) => getReqErrWithDefaults({ status: HttpStatusCode.BadRequest, errCode: UpdateGoalReqErrorCodes.GoalNotFound }, params),
	[UpdateGoalReqErrorCodes.MissingGoalIdOrCategory]: (params: {}) => getReqErrWithDefaults({ status: HttpStatusCode.BadRequest, errCode: UpdateGoalReqErrorCodes.MissingGoalIdOrCategory }, params),
} as const;