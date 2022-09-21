import { TGoalCategory, TGoal } from "@goal-tracker/shared/src/utils/GoalUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      addGoal: (state, action: PayloadAction<TGoal>) => {
        state.goals?.[action.payload.category]?.unshift(action.payload);
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
            goal.category = action.payload.newCategory;

            listForRemoval?.splice(goalIndex, 1);
            listForAddition?.unshift(goal);
          }
        }
      }
    }
});

export const { setGoals, moveGoal, addGoal } = userGoalsSlice.actions;
export default userGoalsSlice.reducer;