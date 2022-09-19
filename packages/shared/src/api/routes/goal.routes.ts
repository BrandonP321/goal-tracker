import type { TRouteUrlParams } from ".";

export const GoalRoutes = {
	CreateGoal: ({}: TRouteUrlParams) => `/api/goal/create`,
	GetUserGoals: ({}: TRouteUrlParams) => `/api/user/me/goals`,
	UpdateGoal: ({}: TRouteUrlParams) => `/api/goals/update`,
} as const;