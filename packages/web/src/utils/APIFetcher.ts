import { TAPIRequest } from "@goal-tracker/shared/src/api/Requests";
import { LoginUserRequest, RegisterUserRequest } from "@goal-tracker/shared/src/api/Requests/Auth/Auth.requests";
import { GetUserGoalsRequest } from "@goal-tracker/shared/src/api/Requests/Goal/Goal.requests";
import { Routes } from "@goal-tracker/shared/src/api/routes";
import axios, { AxiosResponse } from "axios";

type AxiosRequest<T extends TAPIRequest = TAPIRequest> = (data: T["ReqBody"]) => Promise<AxiosResponse<T["ResBody"]>>

export class APIFetcher {
	private static APIDomain = process.env.REACT_APP_API_DOMAIN;

	public static post = function<T extends TAPIRequest>(path: string): AxiosRequest<T> {
		return (data) => axios.post(`${APIFetcher.APIDomain}${path}`, data, { withCredentials: true })
	}

	public static get = function<T extends TAPIRequest>(path: string): AxiosRequest<T> {
		return () => axios.get(`${APIFetcher.APIDomain}${path}`, { withCredentials: true });
	}

	/* AUTH */
	public static RegisterUser = APIFetcher.post<RegisterUserRequest.TRequest>(Routes.Auth.Register({}));
	public static LoginUser = APIFetcher.post<LoginUserRequest.TRequest>(Routes.Auth.Login({}))

	/* GOALS */
	public static GetUserGoals = APIFetcher.get<GetUserGoalsRequest.TRequest>(Routes.Goal.GetUserGoals({}));
}

