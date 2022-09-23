import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";
import { UpdateGoalRequest } from "@goal-tracker/shared/src/api/Requests/Goal/Goal.requests";
import { TGoal, TGoalCategory } from "@goal-tracker/shared/src/utils/GoalUtils";
import bcrypt from "bcrypt";

/** See {@link UserModel.InstanceMethods.toFullJSON} */
const toFullJSON: UserModel.InstanceMethods["toFullJSON"] = async function(this: UserModel.Document) {
	// flatten user JSON and remove sensitive fields
	const userJSON = this.toJSON();
	userJSON.id = this.id;
	
	return removeSensitiveData(userJSON);
}

/** See {@link UserModel.InstanceMethods.toShallowJSON} */
const toShallowJSON: UserModel.InstanceMethods["toShallowJSON"] = async function(this: UserModel.Document) {
	return {
		email: this.email, id: this.id, username: this.username
	}
}

/** See {@link UserModel.InstanceMethods.validatePassword} */
const validatePassword: UserModel.InstanceMethods["validatePassword"] = async function(this: UserModel.Document, password: string) {
	return bcrypt.compare(password, this.password);
}

/** Removes sensitive data from user JSON */
const removeSensitiveData = function(user: UserModel.User): UserModel.WithoutSensitiveData<UserModel.User> {
	// properties that need to be removed from user JSON
	const sensitiveFields: {[key in UserModel.SensitiveFields]: true} = {
		jwtHash: true, password: true,
	}

	const strippedUser = {...user};

	// remove each field from user JSON
	let field: UserModel.SensitiveFields;
	for (field in sensitiveFields) {
		delete strippedUser[field];
	}

	return strippedUser as UserModel.WithoutSensitiveData<UserModel.User>;
}

/** See {@link UserModel.InstanceMethods.addJWTHash} */
const addJWTHash: UserModel.InstanceMethods["addJWTHash"] = async function(this: UserModel.Document, hash) {
	this.jwtHash = {...(this.jwtHash ?? {}), [hash]: true}
	await this.save();
}

/** See {@link UserModel.InstanceMethods.removeJWTHash} */
const removeJWTHash: UserModel.InstanceMethods["removeJWTHash"] = async function(this: UserModel.Document, hash) {
	const newJwtHashObj = {...this.jwtHash};
	delete newJwtHashObj[hash];

	this.jwtHash = newJwtHashObj;
	await this.save();
}

/** See {@link UserModel.InstanceMethods.addGoal} */
const addGoal: UserModel.InstanceMethods["addGoal"] = async function(this: UserModel.Document, goal: TGoal) {
	try {
		// TODO: just push new goal to goal list and mark "goals" as modified
		this.goals = {
			...(this.goals ?? {}),
			[goal.category]: [
				goal,
				...(this.goals[goal.category] ?? []),
			]
		} as UserModel.User["goals"]
		await this.save();

		return goal;
	} catch (err) {
		return undefined;
	}
}

/** See {@link UserModel.InstanceMethods.removeGoal} */
const removeGoal: UserModel.InstanceMethods["removeGoal"] = async function(this: UserModel.Document, goalId: string, goalCategory: TGoalCategory) {
	try {
		const goalIndex = this.goals?.[goalCategory]?.findIndex(g => g.id === goalId) ?? -1;
	
		if (goalIndex === -1) {
			return false;
		}
	
		this.goals?.[goalCategory]?.splice(goalIndex, 1);
	
		this.markModified("goals");
		this.save();

		return true;
	} catch (err) {
		return false;
	}
}

/** See {@link UserModel.InstanceMethods.updateGoal} */
const updateGoal: UserModel.InstanceMethods["updateGoal"] = async function(this: UserModel.Document, goalId: string, category: TGoalCategory, updates: UpdateGoalRequest.TReqBody) {
	const goalIndex = this.goals?.[category]?.findIndex(g => g.id === goalId);

	if (goalIndex === -1) {
		return { foundGoal: false, updatedGoal: false };
	}

	const goal = this.goals[category][goalIndex];
	
	// new category to move goal to if provided in updates obj
	const newCategory = updates.category;
	const isChangingCategories = !!newCategory && (goal.category !== updates.category)	
	
	// update goal with new values
	this.goals[category][goalIndex] = { 
		id: goal.id,
		category: updates.category ?? goal.category,
		isComplete: updates.isComplete ? updates.isComplete === "true" : goal.isComplete,
		notes: updates.notes ?? goal.notes,
		title: updates.title ?? goal.title
	}
	
	const modifiedGoal = this.goals[category][goalIndex];

	// if goal is being moved to new category, move goal to new array of goals
	if (isChangingCategories) {
		// remove goal from it's current array
		this.goals[category]?.splice(goalIndex, 1);

		// push goal to new array
		this.goals[newCategory]?.unshift(modifiedGoal);
	}

	this.markModified("goals");
	
	await this.save()

	return { foundGoal: true, updatedGoal: true };
}

export const UserMethods: UserModel.InstanceMethods = {
	toFullJSON,
	toShallowJSON,
	validatePassword,
	addJWTHash,
	removeJWTHash,
	addGoal,
	updateGoal,
	removeGoal
}