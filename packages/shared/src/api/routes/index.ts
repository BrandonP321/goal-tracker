import { AuthRoutes } from "./auth.routes";
import { GoalRoutes } from "./goal.routes";
import { UserRoutes } from "./user.routes";

/** Constructs type of object that is passed in to a route function that return an API endopint url */
export type TRouteUrlParams<TRequiredVars extends string = "", TOptionalVars extends string = ""> = 
	("" extends TRequiredVars ? {} : {[key in TRequiredVars]: string}) & 
	("" extends TOptionalVars ? {} : {[key in TOptionalVars]?: string});

export const Routes = {
	Auth: AuthRoutes,
	User: UserRoutes,
	Goal: GoalRoutes
}