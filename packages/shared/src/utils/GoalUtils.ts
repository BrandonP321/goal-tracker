export type TGoalCategory = "today" | "week" | "month" | "unassigned"

export type TGoal = {
  title: string;
  desc: string;
  isComplete: boolean;
  category: TGoalCategory;
  id: string;
}

export class GoalUtils {
	public static CategoryNames: {[key in TGoalCategory]: string} = {
		month: "Month",
		today: "Today",
		unassigned: "Unassigned",
		week: "Week"
	}

	public static getValidCategoriesForMove = (currentCategory: TGoalCategory) => {
		const allCategories: TGoalCategory[] = ["today", "week", "month", "unassigned"];

		return allCategories.filter(c => c !== currentCategory);
	}
}