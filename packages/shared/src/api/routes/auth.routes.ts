import type { TRouteUrlParams } from ".";

export const AuthRoutes = {
	Register: ({}: TRouteUrlParams) => `/api/auth/register`,
	Login: ({}: TRouteUrlParams) => `/api/auth/login`,
	Signout: ({}: TRouteUrlParams) => `/api/auth/signout`,
	CheckIsUserAuthed: ({}: TRouteUrlParams) => `/api/auth/status`
} as const;