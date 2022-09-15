import type { TRouteUrlParams } from ".";

export const UserRoutes = {
	GetFullUser: ({}: TRouteUrlParams) => `/api/user/me`,
	GetUserGoals: ({}: TRouteUrlParams) => `/api/user/me/goals`
} as const;