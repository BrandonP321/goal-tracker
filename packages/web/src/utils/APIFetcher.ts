import { DefaultRequestErrorCodes, TAPIRequest, TDefaultErrResponse } from "@goal-tracker/shared/src/api/Requests";
import { AuthStatusRequest, LoginUserRequest, RegisterUserRequest } from "@goal-tracker/shared/src/api/Requests/Auth/Auth.requests";
import { CreateGoalRequest, DeleteGoalRequest, GetUserGoalsRequest, UpdateGoalRequest } from "@goal-tracker/shared/src/api/Requests/Goal/Goal.requests";
import { Routes } from "@goal-tracker/shared/src/api/routes";
import axios, { AxiosResponse } from "axios";
import { NavigateFunction } from "react-router-dom";

type AxiosRequest<T extends TAPIRequest = TAPIRequest> = (data: T["ReqBody"]) => Promise<AxiosResponse<T["ResBody"]>>;
type AxiosDeleteRequest<T extends TAPIRequest = TAPIRequest> = (data: T["Urlparams"]) => Promise<AxiosResponse<T["ResBody"]>>;

export class APIFetcher {
	private static APIDomain = process.env.REACT_APP_API_DOMAIN;

	private static post = function<T extends TAPIRequest>(path: string): AxiosRequest<T> {
		return (data) => axios.post(`${APIFetcher.APIDomain}${path}`, data, { withCredentials: true })
	}

	private static put = function<T extends TAPIRequest>(path: string): AxiosRequest<T> {
		return (data) => axios.put(`${APIFetcher.APIDomain}${path}`, data, { withCredentials: true })
	}

	private static get = function<T extends TAPIRequest>(path: string): AxiosRequest<T> {
		return () => axios.get(`${APIFetcher.APIDomain}${path}`, { withCredentials: true });
	}

	private static delete = function<T extends TAPIRequest>(path: (params: T["Urlparams"]) => string): AxiosDeleteRequest<T> {
		return (data) => axios.delete(`${APIFetcher.APIDomain}${path(data)}`, { withCredentials: true })
	}

	/* AUTH */
	public static RegisterUser = APIFetcher.post<RegisterUserRequest.TRequest>(Routes.Auth.Register({}));
	public static LoginUser = APIFetcher.post<LoginUserRequest.TRequest>(Routes.Auth.Login({}));
	public static CheckAuthStatus = APIFetcher.get<AuthStatusRequest.TRequest>(Routes.Auth.CheckIsUserAuthed({}));

	/* GOALS */
	public static GetUserGoals = APIFetcher.get<GetUserGoalsRequest.TRequest>(Routes.Goal.GetUserGoals({}));
	public static CreateGoal = APIFetcher.post<CreateGoalRequest.TRequest>(Routes.Goal.CreateGoal({}));
	public static UpdateUserGoal = APIFetcher.put<UpdateGoalRequest.TRequest>(Routes.Goal.UpdateGoal({}));
	public static DeleteGoal = APIFetcher.delete<DeleteGoalRequest.TRequest>(Routes.Goal.DeleteGoal);

	/** Handles default API error codes before executing a callback to handle any other errors */
	public static ErrHandler = <T extends TDefaultErrResponse>(apiErr: any, navigate: NavigateFunction, cb: (err: Required<T>["response"]) => void) => {
		const err = apiErr?.response?.data;

		// if no error or errCode was sent in error response, an error has occurred connecting with the server
		if (!err || !err.errCode) {
			return alert("Unable to connect to server.");
		}

		// handle default api error codes
		switch (err.errCode) {
			case DefaultRequestErrorCodes.UnexpectedCondition:
				return alert("An unexpected error has occurred.  Please refresh this page.")
			case DefaultRequestErrorCodes.UserMustReAuth:
				return navigate("/Auth");
		}

		// if no default errors had to be handled, execute callback
		return cb(apiErr.response);
	}
}

