import { FormUtils, TFilledFormFields, TFormField } from "./FormUtils";
import { Loc } from "./LocalizationUtils";
import { RegexUtils } from "./RegexUtils";

export type TGoalCategory = "today" | "week" | "month" | "unassigned"

export type TGoalCreationFieldId = "title" | "notes" | "category";
export type TGoalUpdateFieldId = TGoalCreationFieldId | "isComplete";

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

	/** Fields that must be provided by user when creating a new goal */
	public static GoalCreationFields: TFormField<TGoalCreationFieldId>[] = [
		{ fieldId: "title", required: true, tests: [] },
		{ fieldId: "notes", required: false, tests: [] },
		{ fieldId: "category", required: true, tests: [{ test: (v, fields) => RegexUtils.goalCategoryRegex.test(v), errMsg: Loc.Goals.InvalidCategory }] }
	]

	/** Fields that must be provided by user when updating a goal */
	public static GoalUpdateFields: TFormField<TGoalUpdateFieldId>[] = [
		{ fieldId: "title", required: false, tests: [] },
		{ fieldId: "notes", required: false, tests: [] },
		{ fieldId: "category", required: false, tests: [{ test: (v, fields) => RegexUtils.goalCategoryRegex.test(v), errMsg: Loc.Goals.InvalidCategory }] },
		{ fieldId: "isComplete", required: false, tests: [{ test: (v) => (["true", "false"].includes(v)), errMsg: Loc.Goals.InvalidNotesForUpdate }] }
	]

	public static ValidateGoalCreationFields = (fields: TFilledFormFields<TGoalCreationFieldId>) => {
		return FormUtils.ValidateFormFields(fields, this.GoalCreationFields);
	}

	public static ValidateGoalUpdateFields = (fields: Partial<TFilledFormFields<TGoalUpdateFieldId>>) => {
		return FormUtils.ValidateFormFields(fields, this.GoalUpdateFields);
	}

	/** Returns array of categories a goal can be moved to, excluding it's current category */
	public static getValidCategoriesForMove = (currentCategory: TGoalCategory) => {
		const allCategories: TGoalCategory[] = ["today", "week", "month", "unassigned"];

		return allCategories.filter(c => c !== currentCategory);
	}
}