import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";

export type TUserDocSaveErr = {
	reason?: "emailOrUsernameTaken",
	duplicateKey?: "email" | "username";
}

type TDocSaveErr = Error & {
	code?: number;
	[key: string]: any;
}

const DuplicateUniqueKeyErrCode = 11000;

export const handleUserDocSaveErr = async function(err: TDocSaveErr, doc: UserModel.Document, next: (err: any) => void) {
	const errObj: TUserDocSaveErr = { reason: undefined };

	if (err.code === DuplicateUniqueKeyErrCode && err.keyPattern) {
		try {
			errObj.reason = "emailOrUsernameTaken";
			errObj.duplicateKey = Object.keys(err.keyPattern)?.[0] as "email" | "username";
		} catch (err) {}
	}

	next(errObj.reason ? errObj : err);
}