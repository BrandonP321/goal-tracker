import { TAPIRequest, TRequestErrBody, TRequestErrFromErrBody, TRequestErrors, TRequestErrResponse } from "..";
import { TRegistrationFieldId } from "../../../utils/AuthUtils";
import { UserModel } from "../../models/User.model";
import { TRouteUrlParams } from "../../routes";
import { ReqUserRegisterErrors } from "./AuthRequestErrors";
import axios, { AxiosResponse } from "axios";

export namespace RegisterUserRequest {
	export type TUrlParams = TRouteUrlParams<"", "">;
	export type TReqBody = {[key in TRegistrationFieldId]: string};
	export type TResBody = UserModel.ShallowJSON;

	export type TRequest = TAPIRequest<TUrlParams, TReqBody, TResBody>;

	export type ErrResponse = TRequestErrResponse<typeof ReqUserRegisterErrors>;
	export type Errors = TRequestErrors<typeof ReqUserRegisterErrors>;
}