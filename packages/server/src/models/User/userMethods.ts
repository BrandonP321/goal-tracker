import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";
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

export const UserMethods: UserModel.InstanceMethods = {
	toFullJSON,
	toShallowJSON,
	validatePassword,
}