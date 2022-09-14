import { DefaultReqErrors, getReqErrWithDefaults } from "..";
import { TAuthFieldErrors, TRegistrationFieldId } from "../../../utils/AuthUtils";
import { HttpStatusCode } from "../HttpStatusCodes";

export const AuthRegistrationReqErrorCodes = {
	InvalidFieldInput: "InvalidFieldInput",
	EmailOrUsernameTaken: "EmailOrUsernameTaken",
} as const;

export const ReqUserRegisterErrors = {
	...DefaultReqErrors,
	[AuthRegistrationReqErrorCodes.InvalidFieldInput]: (params: {
		invalidFields: TAuthFieldErrors<TRegistrationFieldId>
	}) => getReqErrWithDefaults({ status: HttpStatusCode.BadRequest, errCode: AuthRegistrationReqErrorCodes.InvalidFieldInput }, params),
	[AuthRegistrationReqErrorCodes.EmailOrUsernameTaken]: (params: {
		credentialTaken: Extract<TRegistrationFieldId, "email" | "username">
	}) => getReqErrWithDefaults({ status: HttpStatusCode.Unauthorized, errCode: AuthRegistrationReqErrorCodes.EmailOrUsernameTaken }, params)
} as const;
