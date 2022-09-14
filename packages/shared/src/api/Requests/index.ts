import { AxiosError, AxiosResponse } from "axios";
import { TRouteUrlParams } from "../routes";
import { HttpStatusCode } from "./HttpStatusCodes";

export type TAPIRequest<UrlParams extends TRouteUrlParams, ReqBody = {}, ResBody = {}> = {
	Urlparams: UrlParams;
	ReqBody: ReqBody;
	ResBody: ResBody;
}

export type TStatusCode = Extract<keyof typeof HttpStatusCode, number>;
export type TErrDefaultParams<TErrCode extends string> = { status: TStatusCode; errCode: TErrCode };

type TRequestErrorFuncs<T> = {[key in keyof T]: (params: any) => TRequestErrBody};

/** Error type when being handled on the server */
export type TRequestErrBody<TDefaults = TErrDefaultParams<string>, TBodyParams = {}> = { defaults: TDefaults, params: TBodyParams };
/** Converts error type used in server to type of error sent to client */
export type TRequestErrFromErrBody<T extends TRequestErrBody> = Omit<TRequestErrBody["defaults"], "status"> & T["params"];
/** All possible error responses for a given API request */
export type TRequestErrResponse<T extends TRequestErrorFuncs<T>> = AxiosError<TRequestErrFromErrBody<ReturnType<T[keyof T]>>>;

/** Object of all possible errors responses for an API request */
export type TRequestErrors<T extends TRequestErrorFuncs<T>> = {[key in keyof T]: TRequestErrFromErrBody<ReturnType<T[key]>>};

/**
 * Constructs the error resonse for an API endopint.
 * @param defaults Default properties that every error response should hvae
 * @param params Properties that are unique to this endpoint
 * @returns Error object for API error resopnse with status code, error code, and any other specified properties
 */
export function getReqErrWithDefaults<TParams extends {}, TErrCode extends string>(defaults: TErrDefaultParams<TErrCode>, params: TParams): TRequestErrBody<typeof defaults, typeof params> {
	return {
		defaults,
		params
	}
};

export type TRequestErrorFunc = typeof getReqErrWithDefaults;

export const DefaultRequestErrorCodes = {
	UnexpectedCondition: "UnexpectedCondition",
} as const;

export const DefaultReqErrors = {
	/** 500 Internal server error with optional error message */
	[DefaultRequestErrorCodes.UnexpectedCondition]: (params: { errMsg?: string }) => getReqErrWithDefaults({ status: HttpStatusCode.InternalServerError, errCode: DefaultRequestErrorCodes.UnexpectedCondition }, params),
} as const;