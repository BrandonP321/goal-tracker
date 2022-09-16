import type { TRouteUrlParams } from ".";

export const UserRoutes = {
	GetFullUser: ({}: TRouteUrlParams) => `/api/user/me`,
} as const;