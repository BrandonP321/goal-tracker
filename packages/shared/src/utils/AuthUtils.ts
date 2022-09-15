import { Loc } from "./LocalizationUtils";
import { RegexUtils } from "./RegexUtils";

export type TRegistrationFieldId = "username" | "email" | "password" | "passwordReEnter";
export type TLoginFieldId = "email" | "password";

type TAuthField<TValidFieldId extends string> = {
	fieldId: TValidFieldId;
	required: boolean;
	/** 
	 * Validation tests that must all pass for field value to be accepted, along with 
	 * err msg to display if test fails.  Also takes in all other fields as an argument
	 * for any fields that need to be compared against eachother
	 */
	tests: { test: (value: string, allFields: TFilledAuthFields<TValidFieldId>) => boolean, errMsg: string }[];
}

export type TFilledAuthFields<TValidFieldId extends string> = {[key in TValidFieldId]: string}

export type TAuthFieldErrors<TValidFieldId extends string> = {
	[key in TValidFieldId]?: string;
}

export class AuthUtils {
	public static RegistrationFields: TAuthField<TRegistrationFieldId>[] = [
		{ fieldId: "username", required: true, tests: [{ test: (v, fields) => RegexUtils.usernameRegex.test(v), errMsg: Loc.Auth.UsernameRegexErr }] },
		{ fieldId: "email", required: true, tests: [{ test: (v, fields) => RegexUtils.emailRegex.test(v), errMsg: Loc.Auth.EmailRegexErr }] },
		{ fieldId: "password", required: true, tests: [{ test: (v, fields) => RegexUtils.passwordRegex.test(v), errMsg: Loc.Auth.PasswordRegexErr }] },
		{ fieldId: "passwordReEnter", required: true, tests: [{ test: (v, fields) => (v === fields.password ?? "" === v), errMsg: Loc.Auth.PasswordsDoNotMatch }] },
	]

	public static LoginFields: TAuthField<TLoginFieldId>[] = [
		{ fieldId: "email", required: true, tests: [] },
		{ fieldId: "password", required: true, tests: [] },
	]

	/**
	 * Validates all auth fields user has filled out.
	 */
	public static ValidateAuthFields = <TValidFieldId extends string>(fields: TFilledAuthFields<TValidFieldId>, validationFields: TAuthField<TValidFieldId>[]) => {
		const errors: TAuthFieldErrors<TValidFieldId> = {}

		for (const fieldValidation of validationFields) {

			const fieldValue = fields[fieldValidation.fieldId];

			if ((fieldValidation.required && !this.isRequiredFieldValid(fieldValue))) {
				// if field is required but emptry, send error
				errors[fieldValidation.fieldId] = Loc.Auth.FieldRequired;
			} else {
				// run each test against the field's value
				for (let fieldTest of fieldValidation.tests) {
					// if test fails, push to to err array and then stop iterating on this field's tests
					if (!fieldTest.test(fieldValue, fields)) {
						errors[fieldValidation.fieldId] = fieldTest.errMsg;
						break;
					}
				}
			}
		}

		/* Return error obj, which will be empty if no validation errors were found */
		return errors;
	}

	public static ValidateRegistrationFields = (fields: TFilledAuthFields<TRegistrationFieldId>) => {
		return this.ValidateAuthFields(fields, this.RegistrationFields);
	}

	public static ValidateLoginFields = (fields: TFilledAuthFields<TLoginFieldId>) => {
		return this.ValidateAuthFields(fields, this.LoginFields);
	}

	private static isRequiredFieldValid = (value: string) => {
		return !!value;
	}

	/** Converts submitted form data into an object with the data for each inputed field */
	public static getAuthFormData = <TValidFieldId extends string>(formEle: HTMLFormElement) => {
		const formData = new FormData(formEle)

		const fieldData: Partial<TFilledAuthFields<TValidFieldId>> = {}

		for (const formEntry of formData) {
			const fieldId = formEntry[0] as TValidFieldId;
			const value = formEntry[1] as string;

			fieldData[fieldId] = value;
		}

		return fieldData as TFilledAuthFields<TValidFieldId>;
	}
}