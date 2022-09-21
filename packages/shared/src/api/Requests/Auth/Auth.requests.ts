import { TAPIRequest, TRequestErrors, TRequestErrResponse } from "..";
import { TLoginFieldId, TRegistrationFieldId } from "../../../utils/AuthUtils";
import { UserModel } from "../../models/User.model";
import { TRouteUrlParams } from "../../routes";
import { ReqUserLoginErrors, ReqUserRegisterErrors, ReqUserSignoutErrors, ReqAuthStatusErrors } from "./AuthRequestErrors";

export namespace RegisterUserRequest {
	export type TUrlParams = TRouteUrlParams<"", "">;
	export type TReqBody = {[key in TRegistrationFieldId]: string};
	export type TResBody = UserModel.ShallowJSON;

	export type TRequest = TAPIRequest<TUrlParams, TReqBody, TResBody>;

	export type ErrResponse = TRequestErrResponse<typeof ReqUserRegisterErrors>;
	export type Errors = TRequestErrors<typeof ReqUserRegisterErrors>;
}

export namespace LoginUserRequest {
	export type TUrlParams = TRouteUrlParams<"", "">;
	export type TReqBody = {[key in TLoginFieldId]: string};
	export type TResBody = UserModel.ShallowJSON;

	export type TRequest = TAPIRequest<TUrlParams, TReqBody, TResBody>;

	export type ErrResponse = TRequestErrResponse<typeof ReqUserLoginErrors>;
	export type Errors = TRequestErrors<typeof ReqUserLoginErrors>;
}

export namespace SignoutUserRequest {
	export type TUrlParams = TRouteUrlParams<"", "">;
	export type TReqBody = {}
	export type TResBody = {};

	export type TRequest = TAPIRequest<TUrlParams, TReqBody, TResBody>;

	export type ErrResponse = TRequestErrResponse<typeof ReqUserSignoutErrors>;
	export type Errors = TRequestErrors<typeof ReqUserSignoutErrors>;
}

export namespace AuthStatusRequest {
	export type TUrlParams = TRouteUrlParams<"", "">;
	export type TReqBody = {}
	export type TResBody = {};

	export type TRequest = TAPIRequest<TUrlParams, TReqBody, TResBody>;

	export type ErrResponse = TRequestErrResponse<typeof ReqAuthStatusErrors>;
	export type Errors = TRequestErrors<typeof ReqAuthStatusErrors>;
}