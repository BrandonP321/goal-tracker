import type { TRouteUrlParams } from ".";

export const GoalRoutes = {
	CreateGoal: ({}: TRouteUrlParams) => `/api/goal/create`,
} as const;