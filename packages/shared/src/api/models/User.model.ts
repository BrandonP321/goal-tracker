import { ResponseJSON, TDefaultModelProps, TMongooseDoc, TMongooseModel, TMongooseSchema } from ".";
import { TGoal, TGoalCategory } from "../../utils/GoalUtils";
import { UpdateGoalRequest } from "../Requests/Goal";

export namespace UserModel {
	export type User = TDefaultModelProps & {
		email: string;
		password: string;
		username: string;
		jwtHash: {[key: string]: boolean};
		goals: {[key in TGoalCategory]: TGoal[]}
	}
	
	export type Document = TMongooseDoc<User, InstanceMethods>;
	export type Schema = TMongooseSchema<User, InstanceMethods, StaticMethods>;
	export type Model = TMongooseModel<User, InstanceMethods, Schema>
	
	export type InstanceMethods = {
		toShallowJSON: () => Promise<ShallowJSON>;
		toFullJSON: () => Promise<FullJSON>;
		validatePassword: (password: string) => Promise<boolean>;
		/** Adds new token hash to user's list of token hashes used to validate refresh tokens */
		addJWTHash: (hash: string) => Promise<void>;
		removeJWTHash: (hash: string) => Promise<void>;
		addGoal: (goal: TGoal) => Promise<TGoal | undefined>;
		updateGoal: (goalId: string, category: TGoalCategory, updates: UpdateGoalRequest.TReqBody) => Promise<{ foundGoal: boolean, updatedGoal: boolean }>
	}
	
	export type StaticMethods = {

	}
	
	/** User JSON with all data */
	export type FullJSON = ResponseJSON<WithoutSensitiveData<User>>;
	/** User JSON with only essential data for auth */
	export type ShallowJSON = ResponseJSON<Pick<FullJSON, "email" | "username" | "id">>

	export type SensitiveFields = "password" | "jwtHash";
	/** Removes sensitive data from user JSON */
	export type WithoutSensitiveData<T extends {}> = Omit<T, SensitiveFields>;
}