import { DefaultReqErrors, getReqErrWithDefaults, UserRequestErrors } from "..";
import { HttpStatusCode } from "../HttpStatusCodes";

export const GetFullUserReqErrorCodes = {
} as const;

export const GetFullUserErrors = {
	...DefaultReqErrors,
	...UserRequestErrors,
} as const;