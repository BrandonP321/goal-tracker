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
		/** Returns user JSON with basic user data */
		toShallowJSON: () => Promise<ShallowJSON>;
		/** returns full user JSON without sensitive data */
		toFullJSON: () => Promise<FullJSON>;
		/** Validates password provided by user */
		validatePassword: (password: string) => Promise<boolean>;
		/** Adds new jwt ID to user's list of token IDs used to validate refresh tokens */
		addJWTHash: (hash: string) => Promise<void>;
		/** Removes jwt ID from user doc */
		removeJWTHash: (hash: string) => Promise<void>;
		/** Adds new goal to user's list of goals for a given category */
		addGoal: (goal: TGoal) => Promise<TGoal | undefined>;
		/** Updates goal on user doc */
		updateGoal: (goalId: string, category: TGoalCategory, updates: UpdateGoalRequest.TReqBody) => Promise<{ foundGoal: boolean, updatedGoal: boolean }>;
		/** Removes goal from user doc */
		removeGoal: (goalId: string, category: TGoalCategory) => Promise<boolean>
	}
	
	export type StaticMethods = {

	}
	
	/** User JSON with all data */
	export type FullJSON = ResponseJSON<WithoutSensitiveData<User>>;
	/** User JSON with only essential data for auth */
	export type ShallowJSON = ResponseJSON<Pick<FullJSON, "email" | "username" | "id">>

	/** Sensitive fields that should not be included in API response */
	export type SensitiveFields = "password" | "jwtHash";
	/** Removes sensitive data from user JSON */
	export type WithoutSensitiveData<T extends {}> = Omit<T, SensitiveFields>;
}