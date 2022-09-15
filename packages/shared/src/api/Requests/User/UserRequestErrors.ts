import { DefaultReqErrors, getReqErrWithDefaults } from "..";
import { HttpStatusCode } from "../HttpStatusCodes";

export const GetFullUserReqErrorCodes = {
	UserNotFound: "UserNotFound"
} as const;

export const GetFullUserErrors = {
	...DefaultReqErrors,
	[GetFullUserReqErrorCodes.UserNotFound]: (params: {}) => getReqErrWithDefaults({ status: HttpStatusCode.NotFound, errCode: GetFullUserReqErrorCodes.UserNotFound }, params),
} as const;