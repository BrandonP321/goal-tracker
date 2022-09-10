import React from "react";
import { PathRouteProps, Route } from "react-router-dom";

type TRoute = Omit<PathRouteProps, "element"> & { element: any };

export class RouteDefs {
	public static routes: TRoute[] = [
		{ path: "/Auth", element: () => import("~Pages/Auth/Auth") },
		{ path: "/Dashboard", element: () => import("~Pages/GoalsDashboard/GoalsDashboard") },
		{ path: "*", element: () => import("~Pages/PageNotFound/PageNotFound") },
	]

	/** Returns <Route>'s for each route, using React.lazy to introduce code splitting */
	public static get mappedRoutes() { return this.routes.map((route, i) => {
		const { element, ...rest } = route;

		const LazyComponent = React.lazy(route.element);

		return <Route {...rest} key={i} element={<LazyComponent/>}/>
	}) }
}