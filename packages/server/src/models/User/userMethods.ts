import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";
import { TGoal } from "@goal-tracker/shared/src/utils/GoalUtils";
import bcrypt from "bcrypt";

const toFullJSON: UserModel.InstanceMethods["toFullJSON"] = async function(this: UserModel.Document) {
	// flatten user JSON and remove sensitive fields
	return removeSensitiveData(this.toJSON());
}


const toShallowJSON: UserModel.InstanceMethods["toShallowJSON"] = async function(this: UserModel.Document) {
	return {
		email: this.email, id: this.id, username: this.username
	}
}

const validatePassword: UserModel.InstanceMethods["validatePassword"] = async function(this: UserModel.Document, password: string) {
	return bcrypt.compare(password, this.password);
}

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

const addJWTHash: UserModel.InstanceMethods["addJWTHash"] = async function(this: UserModel.Document, hash) {
	this.jwtHash = {...(this.jwtHash ?? {}), [hash]: true}
	await this.save();
}

const removeJWTHash: UserModel.InstanceMethods["removeJWTHash"] = async function(this: UserModel.Document, hash) {
	const newJwtHashObj = {...this.jwtHash};
	delete newJwtHashObj[hash];

	this.jwtHash = newJwtHashObj;
	await this.save();
}

const addGoal: UserModel.InstanceMethods["addGoal"] = async function(this: UserModel.Document, goal: TGoal) {
	try {
		this.goals = {
			...(this.goals ?? {}),
			[goal.category]: [
				...(this.goals[goal.category] ?? []),
				goal
			]
		} as UserModel.User["goals"]
		await this.save();

		return goal;
	} catch (err) {
		return undefined;
	}
}

export const UserMethods: UserModel.InstanceMethods = {
	toFullJSON,
	toShallowJSON,
	validatePassword,
	addJWTHash,
	removeJWTHash,
	addGoal
}