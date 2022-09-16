import { AuthRoutes } from "./auth.routes";
import { GoalRoutes } from "./goal.routes";
import { UserRoutes } from "./user.routes";

/** Utility type that returns type of params object parameter used in functions for getting API endpoints */
export type TRouteUrlParams<TRequiredVars extends string = "", TOptionalVars extends string = ""> = 
	("" extends TRequiredVars ? {} : {[key in TRequiredVars]: string}) & 
	("" extends TOptionalVars ? {} : {[key in TOptionalVars]?: string});

export const Routes = {
	Auth: AuthRoutes,
	User: UserRoutes,
	Goal: GoalRoutes
}