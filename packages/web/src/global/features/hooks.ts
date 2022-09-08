import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ResponsiveState } from "./slices/Responsive/ResponsiveSlice";
import type { AppDispatch, RootState } from "./store";

// export appropriately typed `useDispatch` and `useAppSelector` hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type TResponsiveHookOverload = {
	(param?: undefined): ResponsiveState;
	(param: keyof ResponsiveState): boolean;
}

/**
 * Responsive hook that returns the current status of each css breakpoint
 * @param breakpoint optional breakpoint string for returning only a single boolean value for that breakpoint 
 * @returns object of booleans for each breakpoint if no breakpoint parameter is specified, otherwise returns a boolean for the specified breakpoint 
 */
export const useResponsive: TResponsiveHookOverload = (breakpoint?: keyof ResponsiveState): any => useAppSelector(({ responsive: r }) => breakpoint ? r[breakpoint] : r);