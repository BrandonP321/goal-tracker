import { PathRouteProps, Route } from "react-router-dom";

type TRoute = PathRouteProps;

export class RouteDefs {
	public static routes: TRoute[] = [
		{ path: "/", element: <h1>Helo</h1> }
	]

	public static get mappedRoutes() { return this.routes.map((route, i) => <Route key={i} {...route}/>) }
}