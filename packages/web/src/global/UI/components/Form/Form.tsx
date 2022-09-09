import classNames from "classnames";
import { useState } from "react";
import { ClassesProp } from "~Utils/Helpers";
import styles from "./Form.module.scss";

type FormProps = {
	fields: TValidFormField[]
	onSubmit: () => void;
}

export const FormFields = (props: FormProps) => {
	const { fields, onSubmit } = props;

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

type TFormFieldTypes = "Input" | "Textarea"

type FormField<T extends TFormFieldTypes> = {
	type: T;
	id: string;
	errMsg?: string | null;
}

export type TValidFormField = FormTextInputFieldProps | FormTextareaProps;

export type FormTextInputFieldProps = FormField<"Input"> & {
	placeholder: string;
	inputType?: "text" | "email" | "password" | "tel" | "url";
	name: "name" | "email" | "username" | "current-password" | "new-password" | "url";
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
		<div className={classNames(styles.fieldOuterWrapper, classes?.root)}>
			<div className={classNames(styles.formFieldWrapper, classes?.fieldWrapper, !!value && styles.hasValue, isFocused && styles.focused, !!errMsg && styles.error)}>
				<input {...rest}
					className={classNames(styles.formInput, classes?.input)}
					type={inputType}
					autoComplete={autoComplete ? "on" : "off"}
					onChange={(e) => setValue(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
				<p className={classNames(styles.fieldPlaceholder, classes?.placeholder)}>{placeholder}</p>
			</div>
			{errMsg && <p className={classNames(styles.fieldErr, classes?.errMsg)}>{errMsg}</p>}
		</div>
	)
}

export type FormTextareaProps = FormField<"Textarea"> & {
	text: string;
}

export const FormTextareaField = (props: FormTextareaProps) => {
	return (
		<div />
	)
}

export const defaultFormFields = {
	Input: FormTextInputField,
	Textarea: FormTextareaField
}