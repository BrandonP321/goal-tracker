import { AxiosError, AxiosResponse } from "axios";
import { TRouteUrlParams } from "../routes";
import { HttpStatusCode } from "./HttpStatusCodes";

/** Data required to construct API Request */
export type TAPIRequest<UrlParams extends TRouteUrlParams = {}, ReqBody = {}, ResBody = {}> = {
	Urlparams: UrlParams;
	ReqBody: ReqBody;
	ResBody: ResBody;
}

export type TStatusCode = Extract<keyof typeof HttpStatusCode, number>;
/** Default params that should be included in EVERY API response */
export type TErrDefaultParams<TErrCode extends string> = { status: TStatusCode; errCode: TErrCode };

/** Annotates type of object of functions used to respond to an API request with an error */
type TRequestErrorFuncs<T> = {[key in keyof T]: (params: any) => TRequestErrBody};

/** Error object while error is being constructed by the API */
export type TRequestErrBody<TDefaults = TErrDefaultParams<string>, TBodyParams = {}> = { defaults: TDefaults, params: TBodyParams };
/** Converts API error obj to appropriate response JSON to be sent to client */
export type TRequestErrFromErrBody<T extends TRequestErrBody> = Omit<TRequestErrBody["defaults"], "status"> & T["params"];
/** All possible error responses for a given API request */
export type TRequestErrResponse<T extends TRequestErrorFuncs<T>> = AxiosError<TRequestErrFromErrBody<ReturnType<T[keyof T]>>>;

/** Error function return types */
export type TRequestErrors<T extends TRequestErrorFuncs<T>> = {[key in keyof T]: TRequestErrFromErrBody<ReturnType<T[key]>>};

/**
 * Constructs the error resonse JSON for an API endopint.
 * @param defaults Default properties that every error response should hvae
 * @param params Error object unique to this error
 * @returns Error object for API error resopnse with status code, error code, and any other unique properties
 */
export function getReqErrWithDefaults<TParams extends {}, TErrCode extends string>(defaults: TErrDefaultParams<TErrCode>, params: TParams): TRequestErrBody<typeof defaults, typeof params> {
	return {
		defaults,
		params
	}
};

export type TRequestErrorFunc = typeof getReqErrWithDefaults;

/** Default error codes that could occur on any API request */
export const DefaultRequestErrorCodes = {
	UnexpectedCondition: "UnexpectedCondition",
	UserMustReAuth: "UserMustReAuth",
} as const;

/** Error functions that could be exectuted on any API endpoint */
export const DefaultReqErrors = {
	/** 500 Internal server error with optional error message */
	[DefaultRequestErrorCodes.UnexpectedCondition]: (params: { errMsg?: string }) => getReqErrWithDefaults({ status: HttpStatusCode.InternalServerError, errCode: DefaultRequestErrorCodes.UnexpectedCondition }, params),
	[DefaultRequestErrorCodes.UserMustReAuth]: (params: { errMsg?: string }) => getReqErrWithDefaults({ status: HttpStatusCode.Unauthorized, errCode: DefaultRequestErrorCodes.UserMustReAuth }, params),
} as const;

/** Error codes for any API request that interacts with the User model */
export const UserRequestErrorCodes = {
	UserNotFound: "UserNotFound",
} as const;

/** Error functions that can be executed when interacting with the User model */
export const UserRequestErrors = {
	[UserRequestErrorCodes.UserNotFound]: (params: {}) => getReqErrWithDefaults({ status: HttpStatusCode.NotFound, errCode: UserRequestErrorCodes.UserNotFound }, params),
} as const;

export type TDefaultErrResponse = TRequestErrResponse<typeof DefaultReqErrors>;