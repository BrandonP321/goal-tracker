import React from 'react'
import styles from "./Auth.module.scss";
import { Loc } from "@goal-tracker/shared/src/utils/LocalizationUtils";
import { useState } from 'react';
import { FormFields, TValidFormField } from '~Components/Form/Form';
import { DarkToColorGradientBtn, GradientBtn } from '~Components/GradientBtn/GradientBtn';

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

type AuthFormProps = {
	title: string;
	fields: TValidFormField[];
	changeFormText: string;
	changeFormLinkText: string;
	switchForm: () => void;
}

const AuthForm = (props: AuthFormProps) => {
	const {
		fields, title, changeFormText, changeFormLinkText, switchForm
	} = props;

	return (
		<form className={styles.formWrapper} autoComplete="on">
			<h1 className={styles.title}>{title}</h1>
			<FormFields fields={fields} />
			<GradientBtn>{title}</GradientBtn>
			<p className={styles.changeFormText}>{changeFormText} <strong onClick={switchForm}>{changeFormLinkText}</strong></p>
		</form>
	)
}

const loginFields: TValidFormField[] = [
	{ type: "Input", id: "email", name: "email", placeholder: Loc.Auth.Email, classes: {}, autoComplete: true, inputType: "email", required: true, errMsg: null },
	{ type: "Input", id: "password", name: "current-password", placeholder: Loc.Auth.Password, classes: {}, autoComplete: true, inputType: "password", errMsg: null },
];

const registerFields: TValidFormField[] = [
	{ type: "Input", id: "username", name: "username", placeholder: Loc.Auth.Username, classes: {}, autoComplete: true, inputType: "text", required: true, errMsg: null },
	{ type: "Input", id: "email", name: "email", placeholder: Loc.Auth.Email, classes: {}, autoComplete: true, inputType: "email", required: true, errMsg: null },
	{ type: "Input", id: "password", name: "new-password", placeholder: Loc.Auth.Password, classes: {}, autoComplete: false, inputType: "password", errMsg: null },
	{ type: "Input", id: "passwordReEnter", name: "new-password", placeholder: Loc.Auth.ReEnterPassword, classes: {}, autoComplete: false, inputType: "password", errMsg: null },
];

type FormProps = {
	toggleForm: () => void;
}

const LoginForm = (props: FormProps) => {
	return (
		<AuthForm title={Loc.Auth.SignIn} fields={loginFields} changeFormText={Loc.Auth.NoAccount} changeFormLinkText={Loc.Auth.Register} switchForm={props.toggleForm}/>
	)
}

const RegisterForm = (props: FormProps) => {
	return (
		<AuthForm title={Loc.Auth.Register} fields={registerFields} changeFormText={Loc.Auth.AlreadyHaveAccount} changeFormLinkText={Loc.Auth.SignIn} switchForm={props.toggleForm}/>
	)
}