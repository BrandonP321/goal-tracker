import { TAPIRequest } from "@goal-tracker/shared/src/api/Requests";
import { LoginUserRequest, RegisterUserRequest } from "@goal-tracker/shared/src/api/Requests/Auth/Auth.requests";
import { Routes } from "@goal-tracker/shared/src/api/routes";
import axios, { AxiosResponse } from "axios";

export class APIFetcher {
	// TODO: should use env var
	public static APIDomain = "http://localhost:8000";

	public static post = function<T extends TAPIRequest<any, any, any>>(path: string) {
		return (data: T["ReqBody"]) => axios.post<T["ResBody"], AxiosResponse<T["ResBody"]>, T["ReqBody"]>(`${APIFetcher.APIDomain}${path}`, data)
	}

	public static RegisterUser = APIFetcher.post<RegisterUserRequest.TRequest>(Routes.Auth.Register({}));

	public static Loginuser = APIFetcher.post<LoginUserRequest.TRequest>(Routes.Auth.Login({}))
}

