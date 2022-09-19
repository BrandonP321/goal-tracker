import { Loc } from "./LocalizationUtils";

export type TFormField<TValidFieldId extends string> = {
	fieldId: TValidFieldId;
	required: boolean;
	/** 
	 * Validation tests that must all pass for field value to be accepted, along with 
	 * err msg to display if test fails.  Also takes in all other fields as an argument
	 * for any fields that need to be compared against eachother
	 */
	tests: { test: (value: string, allFields: Partial<TFilledFormFields<TValidFieldId>>) => boolean, errMsg: string }[];
}

export type TFilledFormFields<TValidFieldId extends string> = { [key in TValidFieldId]: string }

export type TFormFieldErrors<TValidFieldId extends string> = {
	[key in TValidFieldId]?: string;
}

export class FormUtils {
	/**
	 * Validates all fields user has filled out.
	 */
	public static ValidateFormFields = <TValidFieldId extends string>(fields: Partial<TFilledFormFields<TValidFieldId>>, validationFields: TFormField<TValidFieldId>[]) => {
		const errors: TFormFieldErrors<TValidFieldId> = {}

		for (const fieldValidation of validationFields) {

			const fieldValue = fields[fieldValidation.fieldId];

			if ((fieldValidation.required && !this.isRequiredFieldValid(fieldValue))) {
				// if field is required but emptry, send error
				errors[fieldValidation.fieldId] = Loc.Auth.FieldRequired;
			} else if (fieldValue) {
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

	private static isRequiredFieldValid = (value?: string) => {
		return !!value;
	}

		/** Converts submitted form data into an object with the data for each inputed field */
		public static getFormData = <TValidFieldId extends string = string>(formEle: HTMLFormElement) => {
			const formData = new FormData(formEle)
	
			const fieldData: Partial<TFilledFormFields<TValidFieldId>> = {}
	
			for (const formEntry of formData) {
				const fieldId = formEntry[0] as TValidFieldId;
				const value = formEntry[1] as string;
	
				fieldData[fieldId] = value;
			}
	
			return fieldData as TFilledFormFields<TValidFieldId>;
		}
}