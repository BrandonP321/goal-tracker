import { FormUtils, TFilledFormFields, TFormField, TFormFieldErrors } from "./FormUtils";
import { Loc } from "./LocalizationUtils";
import { RegexUtils } from "./RegexUtils";

export type TRegistrationFieldId = "username" | "email" | "password" | "passwordReEnter";
export type TLoginFieldId = "email" | "password";

export class AuthUtils {
	public static RegistrationFields: TFormField<TRegistrationFieldId>[] = [
		{ fieldId: "username", required: true, tests: [{ test: (v, fields) => RegexUtils.usernameRegex.test(v), errMsg: Loc.Auth.UsernameRegexErr }] },
		{ fieldId: "email", required: true, tests: [{ test: (v, fields) => RegexUtils.emailRegex.test(v), errMsg: Loc.Auth.EmailRegexErr }] },
		{ fieldId: "password", required: true, tests: [{ test: (v, fields) => RegexUtils.passwordRegex.test(v), errMsg: Loc.Auth.PasswordRegexErr }] },
		{ fieldId: "passwordReEnter", required: true, tests: [{ test: (v, fields) => (v === fields.password ?? "" === v), errMsg: Loc.Auth.PasswordsDoNotMatch }] },
	]

	public static LoginFields: TFormField<TLoginFieldId>[] = [
		{ fieldId: "email", required: true, tests: [] },
		{ fieldId: "password", required: true, tests: [] },
	]

	public static ValidateRegistrationFields = (fields: TFilledFormFields<TRegistrationFieldId>) => {
		return FormUtils.ValidateFormFields(fields, this.RegistrationFields);
	}

	public static ValidateLoginFields = (fields: TFilledFormFields<TLoginFieldId>) => {
		return FormUtils.ValidateFormFields(fields, this.LoginFields);
	}
}