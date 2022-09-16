import { FormUtils, TFilledFormFields, TFormField } from "./FormUtils";
import { Loc } from "./LocalizationUtils";
import { RegexUtils } from "./RegexUtils";

export type TGoalCategory = "today" | "week" | "month" | "unassigned"

export type TGoalCreationFieldId = "title" | "notes" | "category";

export const GoalCategories: TGoalCategory[] = ["today", "week", "month", "unassigned"];

export type TGoal = {
  title: string;
  notes: string;
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

	public static GoalCreationFields: TFormField<TGoalCreationFieldId>[] = [
		{ fieldId: "title", required: true, tests: [] },
		{ fieldId: "notes", required: false, tests: [] },
		{ fieldId: "category", required: true, tests: [{ test: (v, fields) => RegexUtils.goalCategoryRegex.test(v), errMsg: Loc.Goals.InvalidCategory }] }
	]

	public static ValidateGoalCreationFields = (fields: TFilledFormFields<TGoalCreationFieldId>) => {
		return FormUtils.ValidateFormFields(fields, this.GoalCreationFields);
	}

	public static getValidCategoriesForMove = (currentCategory: TGoalCategory) => {
		const allCategories: TGoalCategory[] = ["today", "week", "month", "unassigned"];

		return allCategories.filter(c => c !== currentCategory);
	}
}