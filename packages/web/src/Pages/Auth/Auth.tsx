import React from 'react'
import styles from "./Auth.module.scss";
import { Loc } from "@goal-tracker/shared/src/utils/LocalizationUtils";
import { useState } from 'react';
import { FormFields, TValidFormField } from '~Components/Form/Form';
import { GradientBtn } from '~Components/GradientBtn/GradientBtn';
import { AuthUtils, TAuthFieldErrors, TFilledAuthFields, TLoginFieldId, TRegistrationFieldId } from "@goal-tracker/shared/src/utils/AuthUtils";
import { RegisterUserRequest } from "@goal-tracker/shared/src/api/Requests/Auth/Auth.requests";
import { AuthRegistrationReqErrorCodes } from '@goal-tracker/shared/src/api/Requests/Auth/AuthRequestErrors';
import { APIFetcher } from '~Utils/APIFetcher';

type AuthProps = {}

export default function Auth(props: AuthProps) {
	const [activeForm, setActiveForm] = useState<"login" | "register">("login");

	const toggleForm = () => {
		setActiveForm(activeForm === "login" ? "register" : "login");
	}

	return (
		<div className={styles.auth}>
			<div className={styles.accentBall} />
			<div className={styles.darkBall} />

			{activeForm === "login" &&
				<LoginForm toggleForm={toggleForm}/>
			}

			{activeForm === "register" &&
				<RegisterForm toggleForm={toggleForm}/>
			}
		</div>
	)
}

type AuthFormSubmissionHandler<T extends TRegistrationFieldId | TLoginFieldId> = (formData: TFilledAuthFields<T>, setErrors: (errors: TAuthFieldErrors<T>) => void) => void;

type AuthFormProps = {
	title: string;
	fields: TValidFormField[];
	changeFormText: string;
	changeFormLinkText: string;
	switchForm: () => void;
	onSubmit: AuthFormSubmissionHandler<TRegistrationFieldId | TLoginFieldId>;
	validateFields: (formData: TFilledAuthFields<TRegistrationFieldId | TLoginFieldId>) => TAuthFieldErrors<any>;
}

const AuthForm = (props: AuthFormProps) => {
	const {
		fields, title, changeFormText, changeFormLinkText, switchForm, onSubmit, validateFields
	} = props;

	const [validationErrors, setValidationErrors] = useState<TAuthFieldErrors<TRegistrationFieldId | TLoginFieldId>>({});

	const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		// remove all currently displayed errors
		setValidationErrors({});

		const formData = AuthUtils.getAuthFormData<TRegistrationFieldId | TLoginFieldId>(e.currentTarget);

		const fieldErrors = validateFields(formData);

		setValidationErrors(fieldErrors);

		if (Object.keys(fieldErrors).length === 0) {
			// if no validation errors were found, submit data
			onSubmit && onSubmit(formData, setValidationErrors);
		}
	}

	return (
		<form className={styles.formWrapper} onSubmit={handleFormSubmit} autoComplete="on" noValidate>
			<h1 className={styles.title}>{title}</h1>
			<FormFields fields={fields} errors={validationErrors}/>
			<GradientBtn>{title}</GradientBtn>
			<p className={styles.changeFormText}>{changeFormText} <strong onClick={switchForm}>{changeFormLinkText}</strong></p>
		</form>
	)
}

const loginFields: TValidFormField<TLoginFieldId>[] = [
	{ type: "Input", id: "email", name: "email", placeholder: Loc.Auth.Email, classes: {}, autoComplete: true, inputType: "email", required: true, errMsg: null },
	{ type: "Input", id: "password", name: "password", placeholder: Loc.Auth.Password, classes: {}, autoComplete: true, inputType: "password", errMsg: null },
];

const registerFields: TValidFormField<TRegistrationFieldId>[] = [
	{ type: "Input", id: "username", name: "username", placeholder: Loc.Auth.Username, classes: {}, autoComplete: true, inputType: "text", required: true, errMsg: null },
	{ type: "Input", id: "email", name: "email", placeholder: Loc.Auth.Email, classes: {}, autoComplete: true, inputType: "email", required: true, errMsg: null },
	{ type: "Input", id: "password", name: "password", placeholder: Loc.Auth.Password, classes: {}, autoComplete: false, inputType: "password", errMsg: null },
	{ type: "Input", id: "passwordReEnter", name: "passwordReEnter", placeholder: Loc.Auth.ReEnterPassword, classes: {}, autoComplete: false, inputType: "password", errMsg: null },
];

type FormProps = {
	toggleForm: () => void;
}

const LoginForm = (props: FormProps) => {
	const handleSubmit = () => {

	}

	const validateFields: any = (formData: TFilledAuthFields<TLoginFieldId>) => {
		return {}
	}

	return (
		<AuthForm title={Loc.Auth.SignIn} fields={loginFields} changeFormText={Loc.Auth.NoAccount} changeFormLinkText={Loc.Auth.Register} switchForm={props.toggleForm} onSubmit={handleSubmit} validateFields={validateFields}/>
	)
}

const RegisterForm = (props: FormProps) => {
	const handleSubmit: AuthFormSubmissionHandler<TRegistrationFieldId> = (formData, setErrors) => {
		APIFetcher.RegisterUser(formData).then(({ data }) => {
			console.log(data);
		}).catch(({ response }: RegisterUserRequest.ErrResponse) => {
			const err = response?.data;
			console.log(err);
			switch (err?.errCode) {
				case AuthRegistrationReqErrorCodes.EmailOrUsernameTaken:
					const credTakenErr = err as RegisterUserRequest.Errors["EmailOrUsernameTaken"];
					setErrors({ 
						[credTakenErr.credentialTaken]: credTakenErr.credentialTaken === "email" ? Loc.Auth.EmailTaken : Loc.Auth.UsernameTaken })
					break;
				case AuthRegistrationReqErrorCodes.InvalidFieldInput:
					const invalidFieldErr = err as RegisterUserRequest.Errors["InvalidFieldInput"]
					setErrors(invalidFieldErr.invalidFields);
					break;
				default:
					
			}
		})
	}

	const validateFields = (formData: TFilledAuthFields<TRegistrationFieldId>) => {
		return AuthUtils.ValidateRegistrationFields(formData);
	}

	return (
		<AuthForm title={Loc.Auth.Register} fields={registerFields} changeFormText={Loc.Auth.AlreadyHaveAccount} changeFormLinkText={Loc.Auth.SignIn} switchForm={props.toggleForm} onSubmit={handleSubmit} validateFields={validateFields}/>
	)
}