import classNames from "classnames";
import { useState } from "react";
import { ClassesProp } from "~Utils/Helpers";
import styles from "./Form.module.scss";

type FormProps = {
	fields: TValidFormField[]
}

export const FormFields = (props: FormProps) => {
	const { fields } = props;

	return (
		<>
			{fields?.map((f, i) => {
				const FieldEle = defaultFormFields[f.type] as any;

				return !!FieldEle && (
					<FieldEle {...f} key={i} />
				)
			})}
		</>
	)
}

type TFormFieldTypes = "Input" | "Textarea" | "Radio"

type FormField<T extends TFormFieldTypes> = {
	type: T;
	id: string;
	errMsg?: string | null;
}

export type TValidFormField = FormTextInputFieldProps | FormTextareaProps | RadioFormFieldProps;

export type FormTextInputFieldProps = FormField<"Input"> & {
	placeholder: string;
	inputType?: "text" | "email" | "password" | "tel" | "url";
	name: "name" | "email" | "username" | "current-password" | "new-password" | "url" | string;
	required?: boolean;
	autoComplete?: boolean;
	classes?: ClassesProp<"root" | "fieldWrapper" | "input" | "placeholder" | "errMsg">
}

export const FormTextInputField = (props: FormTextInputFieldProps) => {
	const {
		id, classes, inputType, type, autoComplete, placeholder, errMsg, ...rest
	} = props;

	const [value, setValue] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	return (
		<FormFieldWrapper errMsg={errMsg} inputHasValue={!!value} inputId={id} isFocused={isFocused} placeholder={placeholder} classes={classes}>
			<input {...rest}
				id={id}
				className={classNames(styles.formInput, classes?.input)}
				type={inputType}
				autoComplete={autoComplete ? "on" : "off"}
				onChange={(e) => setValue(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
			/>
		</FormFieldWrapper>
	)
}

export type FormTextareaProps = FormField<"Textarea"> & {
	placeholder: string;
	required?: boolean;
	classes?: ClassesProp<"root" | "fieldWrapper" | "textarea" | "placeholder" | "errMsg">
}

export const FormTextareaField = (props: FormTextareaProps) => {
	const {
		id, classes, type, placeholder, errMsg, ...rest
	} = props;

	const [value, setValue] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	return (
		<FormFieldWrapper errMsg={errMsg} inputHasValue={!!value} inputId={id} isFocused={isFocused} placeholder={placeholder} classes={classes}>
			<textarea {...rest}
				id={id}
				className={classNames(styles.formInput, styles.textarea, classes?.textarea)}
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

type RadioFormFieldProps = FormField<"Radio"> & {
	title: string;
	defaultValue?: string;
	options: { title: string; id: string; value: string }[];
	name: string;
}

const RadioFormField = (props: RadioFormFieldProps) => {
	const { id, name, options, type, errMsg, title, defaultValue } = props;

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