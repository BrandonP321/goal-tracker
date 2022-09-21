import { AnyAction, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import responsiveReducer from "~Store/slices/Responsive/ResponsiveSlice";
import pageLoadingReducer from "~Store/slices/PageLoading/PageLoadingSlice";
import userGoalsReducer from "~Store/slices/UserGoals/UserGoalsSlice";
import userReducer from "~Store/slices/User/UserSlice";

/* Returns the type of a redux store with a given slice; for anootating type of store parameters in functions/classes */
export type ReduxStoreWithSlice<SliceState = {}> = EnhancedStore<{
	responsive: SliceState;
}, AnyAction, [ThunkMiddleware<{
	responsive: SliceState;
}, AnyAction, undefined>]>

export const store = configureStore({
	/* object of slice reducers to be combined */
	reducer: {
		responsive: responsiveReducer,
		pageLoading: pageLoadingReducer,
		userGoals: userGoalsReducer,
		user: userReducer
	}
})

// Infer the `RootState` and `AppDispatch` from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type of reducers object for dispatch
export type AppDispatch = typeof store.dispatch;