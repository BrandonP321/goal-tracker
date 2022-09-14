import type { TRouteUrlParams } from ".";

export const AuthRoutes = {
	Register: ({}: TRouteUrlParams) => `/api/auth/register`,
	Login: ({}: TRouteUrlParams) => `/api/auth/login`
} as const;