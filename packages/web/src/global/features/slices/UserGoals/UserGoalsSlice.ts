import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

export type TGoalCategory = "today" | "week" | "month" | "unassigned"

export type TGoal = {
  title: string;
  desc: string;
  isComplete: boolean;
  category: TGoalCategory;
  id: string;
}

export type UserGoalsState = {
  goals: null | {[key in TGoalCategory]: TGoal[]};
  errorUpdatingGoal: boolean;
  haveGoalsLoaded: boolean;
}

const initialState: UserGoalsState = {
  goals: null,
  errorUpdatingGoal: false,
  haveGoalsLoaded: false,
}

const userGoalsSlice = createSlice({
    name: "userGoals",
    initialState,
    reducers: {
      setGoals: (state, action: PayloadAction<UserGoalsState["goals"]>) => {
			  state.goals = {
          today: action.payload?.today ?? [],
          week: action.payload?.week ?? [],
          month: action.payload?.month ?? [],
          unassigned: action.payload?.unassigned ?? []
        }
        state.haveGoalsLoaded = true;
		  },
      moveGoal: (state, action: PayloadAction<{goalId: string; currentCategory: TGoalCategory; newCategory: TGoalCategory}>) => {
        const listForRemoval = state.goals?.[action.payload.currentCategory];
        const listForAddition = state.goals?.[action.payload.newCategory];

        const goalIndex = listForRemoval?.findIndex((goal) => goal.id === action.payload.goalId);

        if (goalIndex === undefined || goalIndex === -1) {
          // if unable to get index of goal in list, report error to user
          state.errorUpdatingGoal = true;
        } else {
          const goal = listForRemoval?.[goalIndex];

          if (goal) {
            listForRemoval?.splice(goalIndex, 1);
            listForAddition?.unshift(goal);
          }
        }
      }
    }
});

export const { setGoals, moveGoal } = userGoalsSlice.actions;
export default userGoalsSlice.reducer;