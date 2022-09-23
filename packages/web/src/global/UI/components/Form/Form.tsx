import { FormUtils, TFilledFormFields, TFormFieldErrors } from "@goal-tracker/shared/src/utils/FormUtils";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { ClassesProp } from "~Utils/Helpers";
import styles from "./Form.module.scss";

/** Type of function to be invoked when form is submitted */
export type FormSubmissionHandler<T extends string = string> = (
	formData: TFilledFormFields<T>,
	setErrors: (errors: { fieldErrors: TFormFieldErrors<T>, formError?: string}
) => void) => void;

/** Returns annotated state for form validation errors */
export const useFormValidationErrors = <T extends string>() => {
	return useState<{ fieldErrors: TFormFieldErrors<T>, formError?: string }>({ fieldErrors: {} });
}

export type FormProps = {
	onSubmit: FormSubmissionHandler<string>;
	validateFields: (formData: TFilledFormFields<string>) => TFormFieldErrors<string>;
	setValidationErrors: ReturnType<typeof useFormValidationErrors>[1];
	children?: React.ReactNode;
	classes?: ClassesProp<"root">;
	inputRef?: React.MutableRefObject<HTMLFormElement | null>;
}

/** Form element that handles field input validation before allowing form to be submitted */
export const Form = (props: FormProps) => {
	const {
		onSubmit, validateFields, setValidationErrors, children, classes, inputRef
	} = props;

	const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		// remove all currently displayed errors
		setValidationErrors({ fieldErrors: {} });

		const formData = FormUtils.getFormData(e.currentTarget);

		// check for any input validation errors
		const fieldErrors = validateFields(formData);

		setValidationErrors({ fieldErrors });

		// submit form if no validation errors were caught
		if (Object.keys(fieldErrors).length === 0) {
			// if no validation errors were found, submit data
			onSubmit && onSubmit(formData, setValidationErrors);
		}
	}

	return (
		<form className={classes?.root} ref={inputRef} onSubmit={handleFormSubmit} autoComplete="on" noValidate>
			{children}
		</form>
	)
}

type FormFieldsProps = {
	fields: TValidFormField[];
	errors: TFormFieldErrors<string>;
}

/** Procedurally renders different input, textarea, etc. elements based on an array of field objects  */
export const FormFields = (props: FormFieldsProps) => {
	const { fields, errors } = props;

	return (
		<>
			{fields?.map((f, i) => {
				const FieldEle = defaultFormFields[f.type] as any;

				return !!FieldEle && (
					<FieldEle {...f} key={i} errMsg={errors?.[f.id] || undefined}/>
				)
			})}
		</>
	)
}

type TFormFieldTypes = "Input" | "Textarea" | "Radio"

/** Basic field properties that every input type should contain */
type FormField<T extends TFormFieldTypes, TValidFieldId extends string = string> = {
	type: T;
	id: TValidFieldId;
	name: TValidFieldId;
	errMsg?: string | null;
	formRef?: React.MutableRefObject<HTMLFormElement | null>;
	defaultValue?: string;
}

export type TValidFormField<TValidFieldId extends string = string> = FormTextInputFieldProps<TValidFieldId> | FormTextareaProps<TValidFieldId> | RadioFormFieldProps<TValidFieldId>;

export type FormTextInputFieldProps<TValidFieldId extends string = string> = FormField<"Input", TValidFieldId> & {
	placeholder: string;
	inputType?: "text" | "email" | "password" | "tel" | "url";
	required?: boolean;
	autoComplete?: boolean;
	classes?: ClassesProp<"root" | "fieldWrapper" | "input" | "placeholder" | "errMsg">;
}

/** <input> element */
export const FormTextInputField = (props: FormTextInputFieldProps) => {
	const {
		id, classes, inputType, type, autoComplete, placeholder, errMsg, formRef, defaultValue, ...rest
	} = props;

	const [value, setValue] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		formRef?.current?.addEventListener("reset", () => setValue(""))
	}, [])

	useEffect(() => {
		setValue(defaultValue ?? "");
	}, [defaultValue])

	return (
		<FormFieldWrapper errMsg={errMsg} inputHasValue={!!value} inputId={id} isFocused={isFocused} placeholder={placeholder} classes={classes}>
			<input {...rest}
				id={id}
				className={classNames(styles.formInput, classes?.input)}
				value={value}
				type={inputType}
				autoComplete={autoComplete ? "on" : "off"}
				onChange={(e) => setValue(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
			/>
		</FormFieldWrapper>
	)
}

export type FormTextareaProps<TValidFieldId extends string = string> = FormField<"Textarea", TValidFieldId> & {
	placeholder: string;
	required?: boolean;
	classes?: ClassesProp<"root" | "fieldWrapper" | "textarea" | "placeholder" | "errMsg">
}

/** <textarea> element */
export const FormTextareaField = (props: FormTextareaProps) => {
	const {
		id, classes, type, placeholder, errMsg, formRef, defaultValue, ...rest
	} = props;

	const [value, setValue] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		formRef?.current?.addEventListener("reset", () => setValue(""))
	}, [])

	useEffect(() => {
		setValue(defaultValue ?? "")
	}, [defaultValue])

	return (
		<FormFieldWrapper errMsg={errMsg} inputHasValue={!!value} inputId={id} isFocused={isFocused} placeholder={placeholder} classes={classes}>
			<textarea {...rest}
				id={id}
				className={classNames(styles.formInput, styles.textarea, classes?.textarea)}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
			/>
		</FormFieldWrapper>
	)
}

type FormFieldWrapperProps = {
	placeholder: string;
	classes?: ClassesProp<"root" | "fieldWrapper" | "placeholder" | "errMsg">;
	children?: React.ReactNode;
	inputHasValue: boolean;
	inputId: string;
	errMsg?: string | null;
	isFocused: boolean;
}

/** input wrapper for handling UI around input element */
const FormFieldWrapper = ({ placeholder, children, classes, inputHasValue, inputId, errMsg, isFocused }: FormFieldWrapperProps) => {

	return (
		<div className={classNames(styles.fieldOuterWrapper, classes?.root)}>
			<div className={classNames(styles.formFieldWrapper, classes?.fieldWrapper, inputHasValue && styles.hasValue, isFocused && styles.focused, !!errMsg && styles.error)}>
				{children}
				<label htmlFor={inputId} className={classNames(styles.fieldPlaceholder, classes?.placeholder)}>{placeholder}</label>
			</div>
			{errMsg && <p className={classNames(styles.fieldErr, classes?.errMsg)}>{errMsg}</p>}
		</div>
	)
}

type RadioFormFieldProps<TValidFieldId extends string = string> = FormField<"Radio", TValidFieldId> & {
	title: string;
	defaultValue?: string;
	options: { title: string; id: string; value: string }[];
}

/** radio input element */
const RadioFormField = (props: RadioFormFieldProps) => {
	const { id, name, options, type, errMsg, title, defaultValue, formRef } = props;

	return (
		<div className={styles.radioSectionWrapper}>
			<p className={styles.radiosTitle}>{title}</p>
			<div className={styles.radiosWrapper}>
				{options?.map((o, i) => {
					const isDefaultChecked = defaultValue === o.value;

					return (
						<div key={i} className={styles.radioOption}>
							<input type="radio" id={o.id} name={name} value={o.value} defaultChecked={isDefaultChecked || undefined}/>
							<p className={styles.radioTitle}>{o.title}</p>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export const defaultFormFields = {
	Input: FormTextInputField,
	Textarea: FormTextareaField,
	Radio: RadioFormField
}