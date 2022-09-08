import { createSlice } from "@reduxjs/toolkit";
import { WindowUtils } from "~Utils/WindowUtils";

export interface PageLoadingState {
	loading: boolean;
}

const initialState: PageLoadingState = {
	loading: true
}

/**
 * Contains the status of the loading screen wrapper
 */
const pageLoadingSlice = createSlice({
    name: "pageLoading",
    initialState,
    reducers: {
        showLoadingSpinner: (state) => {
			state.loading = true;
		},
		hideLoadingSpinner: (state) => {
			state.loading = false;
		}
    }
});

export const { hideLoadingSpinner, showLoadingSpinner } = pageLoadingSlice.actions;
export default pageLoadingSlice.reducer;