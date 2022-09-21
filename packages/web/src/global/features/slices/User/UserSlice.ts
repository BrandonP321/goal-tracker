import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserState = {
  id: string | null;
  username: string | null;
}

const initialState: UserState = {
  id: null,
  username: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setUser: (state, action: PayloadAction<UserState>) => {
			  state.id = action.payload.id;
        state.username = action.payload.username
		  }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;