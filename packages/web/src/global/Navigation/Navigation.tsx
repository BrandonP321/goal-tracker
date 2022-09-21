import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { RouteDefs } from "~Navigation/RouteDefs";
import { useAppDispatch } from "~Store/hooks";
import { hideLoadingSpinner, showLoadingSpinner } from "~Store/slices/PageLoading/PageLoadingSlice";
import { APIFetcher } from "~Utils/APIFetcher";

export default React.memo(function Navigation() {
	return (
		<Router>
			<AuthValidator/>
			<React.Suspense fallback={<FallbackComponent />}>
				<Routes>
					{RouteDefs.mappedRoutes}
				</Routes>
			</React.Suspense>
		</Router>
	)
})

/** Fallback component that shows loading spinner on mount and hides on unmount */
const FallbackComponent = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		// show loading spinner on mount
		dispatch(showLoadingSpinner());

		// hide loading spinner when unmounted
		return () => { dispatch(hideLoadingSpinner()) }
	}, [])

	return null;
}

/** Component that sends user to auth page on app load if user is not authed */
const AuthValidator = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// if auth status endpoint returns any error, have user re-auth
		APIFetcher.CheckAuthStatus({})
			.catch(() => {
				navigate("/Auth");
			})
	}, [])

	return null;
}