import { DefaultReqErrors, getReqErrWithDefaults, UserRequestErrors } from "..";
import { TLoginFieldId, TRegistrationFieldId } from "../../../utils/AuthUtils";
import { TFormFieldErrors } from "../../../utils/FormUtils";
import { HttpStatusCode } from "../HttpStatusCodes";

export const AuthRegistrationReqErrorCodes = {
	InvalidFieldInput: "InvalidFieldInput",
	EmailOrUsernameTaken: "EmailOrUsernameTaken",
} as const;

export const ReqUserRegisterErrors = {
	...DefaultReqErrors,
	[AuthRegistrationReqErrorCodes.InvalidFieldInput]: (params: {
		invalidFields: TFormFieldErrors<TRegistrationFieldId>
	}) => getReqErrWithDefaults({ status: HttpStatusCode.BadRequest, errCode: AuthRegistrationReqErrorCodes.InvalidFieldInput }, params),
	[AuthRegistrationReqErrorCodes.EmailOrUsernameTaken]: (params: {
		credentialTaken: Extract<TRegistrationFieldId, "email" | "username">
	}) => getReqErrWithDefaults({ status: HttpStatusCode.Unauthorized, errCode: AuthRegistrationReqErrorCodes.EmailOrUsernameTaken }, params)
} as const;

export const AuthLoginReqErrorCodes = {
	InvalidFieldInput: "InvalidFieldInput",
	IncorrectEmailOrPassword: "IncorrectEmailOrPassword",
} as const;

export const ReqUserLoginErrors = {
	...DefaultReqErrors,
	[AuthLoginReqErrorCodes.InvalidFieldInput]: (params: {
		invalidFields: TFormFieldErrors<TLoginFieldId>
	}) => getReqErrWithDefaults({ status: HttpStatusCode.BadRequest, errCode: AuthLoginReqErrorCodes.InvalidFieldInput }, params),
	[AuthLoginReqErrorCodes.IncorrectEmailOrPassword]: (params: {}) => getReqErrWithDefaults({ status: HttpStatusCode.Unauthorized, errCode: AuthLoginReqErrorCodes.IncorrectEmailOrPassword }, params)
} as const;

export const AuthSignoutReqErrorCodes = {
} as const;

export const ReqUserSignoutErrors = {
	...DefaultReqErrors,
	...UserRequestErrors,
} as const;

export const AuthStatusReqErrorCodes = {
} as const;

export const ReqAuthStatusErrors = {
	...DefaultReqErrors,
	...UserRequestErrors,
} as const;