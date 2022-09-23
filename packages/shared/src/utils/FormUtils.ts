import { Loc } from "./LocalizationUtils";

/** Data required for each field in a form */
export type TFormField<TValidFieldId extends string> = {
	fieldId: TValidFieldId;
	required: boolean;
	/** 
	 * Validation tests that must all pass for field value to be accepted, along with 
	 * err msg to display if test fails.  Takes in all other fields as an argument
	 * for any fields that need to be validated against other fields
	 */
	tests: { test: (value: string, allFields: Partial<TFilledFormFields<TValidFieldId>>) => boolean, errMsg: string }[];
}

/** Type of field that has been filled out by the user */
export type TFilledFormFields<TValidFieldId extends string> = { [key in TValidFieldId]: string }

/** Error object for any errors that occurred while validating the user's field inputs */
export type TFormFieldErrors<TValidFieldId extends string> = {
	[key in TValidFieldId]?: string;
}

export class FormUtils {
	/**
	 * Validates all fields that should be filled in by user
	 */
	public static ValidateFormFields = <TValidFieldId extends string>(fields: Partial<TFilledFormFields<TValidFieldId>>, validationFields: TFormField<TValidFieldId>[]) => {
		const errors: TFormFieldErrors<TValidFieldId> = {}

		for (const fieldValidation of validationFields) {

			const fieldValue = fields[fieldValidation.fieldId];

			if ((fieldValidation.required && !this.isRequiredFieldValid(fieldValue))) {
				// if field is required but emptry, report error
				errors[fieldValidation.fieldId] = Loc.Auth.FieldRequired;
			} else if (fieldValue) {
				// else if field has a value, run each test against that field's value
				for (let fieldTest of fieldValidation.tests) {
					// if test fails, add error to to err obj and stop iterating on this field's tests
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

	/** Validate required field input */
	private static isRequiredFieldValid = (value?: string) => {
		return !!value;
	}

	/** Converts submitted form data into a usable object */
	public static getFormData = <TValidFieldId extends string = string>(formEle: HTMLFormElement) => {
		// convert form Ele into key/value pairs for each <input>
		const formData = new FormData(formEle)

		// new object to contain form data
		const fieldData: Partial<TFilledFormFields<TValidFieldId>> = {}

		// add each <input>'s id/value as key/value to new form data obj
		for (const formEntry of formData) {
			const fieldId = formEntry[0] as TValidFieldId;
			const value = formEntry[1] as string;

			fieldData[fieldId] = value;
		}

		return fieldData as TFilledFormFields<TValidFieldId>;
	}
}