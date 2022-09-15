import { TAPIRequest, TRequestErrors, TRequestErrResponse } from "..";
import { UserModel } from "../../models/User.model";
import { TRouteUrlParams } from "../../routes";
import { GetFullUserErrors } from "./UserRequestErrors";

export namespace GetFullUserRequest {
	export type TUrlParams = TRouteUrlParams<"", "">;
	export type TReqBody = {};
	export type TResBody = UserModel.FullJSON;

	export type TRequest = TAPIRequest<TUrlParams, TReqBody, TResBody>;

	export type ErrResponse = TRequestErrResponse<typeof GetFullUserErrors>;
	export type Errors = TRequestErrors<typeof GetFullUserErrors>;
}
