import type { TRouteUrlParams } from ".";
import { DeleteGoalRequest } from "../Requests/Goal";

export const GoalRoutes = {
	CreateGoal: ({}: TRouteUrlParams) => `/api/goal/create`,
	GetUserGoals: ({}: TRouteUrlParams) => `/api/user/me/goals`,
	UpdateGoal: ({}: TRouteUrlParams) => `/api/goals/update`,
	DeleteGoal: ({ goalCategoryURI, goalIdURI }: Partial<DeleteGoalRequest.TUrlParams>) => `/api/goals/${goalCategoryURI ?? ":goalCategoryURI"}/${goalIdURI ?? ":goalIdURI"}`,
} as const;