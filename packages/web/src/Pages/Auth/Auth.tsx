import React, { useEffect } from 'react'
import styles from "./Auth.module.scss";
import { Loc } from "@goal-tracker/shared/src/utils/LocalizationUtils";
import { useState } from 'react';
import { Form, FormFields, FormProps, FormSubmissionHandler, TValidFormField, useFormValidationErrors } from '~Components/Form/Form';
import { GradientBtn } from '~Components/GradientBtn/GradientBtn';
import { AuthUtils, TLoginFieldId, TRegistrationFieldId } from "@goal-tracker/shared/src/utils/AuthUtils";
import { LoginUserRequest, RegisterUserRequest } from "@goal-tracker/shared/src/api/Requests/Auth/Auth.requests";
import { AuthLoginReqErrorCodes, AuthRegistrationReqErrorCodes } from '@goal-tracker/shared/src/api/Requests/Auth/AuthRequestErrors';
import { APIFetcher } from '~Utils/APIFetcher';
import { TFilledFormFields } from '@goal-tracker/shared/src/utils/FormUtils';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '~Store/hooks';
import { hideLoadingSpinner } from '~Store/slices/PageLoading/PageLoadingSlice';
import { PageHelmet } from '~FeatureComponents/PageHelmet/PageHelmet';

type AuthProps = {}

export default function Auth(props: AuthProps) {
	const dispatch = useAppDispatch();

	/** Dictates whether login or register form should be displayed */
	const [activeForm, setActiveForm] = useState<"login" | "register">("login");

	useEffect(() => {
		// Always make sure loading spinner is hidden when auth page is loaded in case user is being redirected after re-auth failure
		dispatch(hideLoadingSpinner());
	}, [])

	const toggleForm = () => {
		setActiveForm(activeForm === "login" ? "register" : "login");
	}

	return (
		<div className={styles.auth}>
			<PageHelmet title={activeForm === "login" ? "Login" : "Register"}/>

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

type AuthFormProps = Pick<FormProps, "onSubmit" | "validateFields"> & {
	title: string;
	fields: TValidFormField[];
	changeFormText: string;
	changeFormLinkText: string;
	switchForm: () => void;
	isLoading: boolean;
}

const AuthForm = (props: AuthFormProps) => {
	const {
		fields, title, changeFormText, changeFormLinkText, switchForm, isLoading, ...rest
	} = props;

	/** Field input validation errors */
	const [validationErrors, setValidationErrors] = useFormValidationErrors();

	return (
		<Form {...rest} setValidationErrors={setValidationErrors} classes={{ root: styles.formWrapper }}>
			<h1 className={styles.title}>{title}</h1>

			{/* Procedurally generated form fields */}
			<FormFields fields={fields} errors={validationErrors.fieldErrors}/>

			{validationErrors.formError &&
				<p className={styles.formError}>{validationErrors.formError}</p>
			}

			<GradientBtn isLoading={isLoading}>{title}</GradientBtn>
			<p className={styles.changeFormText}>{changeFormText} <strong onClick={switchForm}>{changeFormLinkText}</strong></p>
		</Form>
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

type TFormProps = {
	toggleForm: () => void;
}

const LoginForm = (props: TFormProps) => {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit: FormSubmissionHandler<TLoginFieldId> = (formData, setErrors) => {
		setIsLoading(true);

		APIFetcher.LoginUser(formData).then((res) => APIFetcher.ResponseHandler(res, () => {
			navigate("/Dashboard", { replace: true });
		})).catch(({response}: LoginUserRequest.ErrResponse) => {
			setIsLoading(false);

			const err = response?.data;

			switch (err?.errCode) {
				case AuthLoginReqErrorCodes.InvalidFieldInput:
					const invalidInputErr = err as LoginUserRequest.Errors["InvalidFieldInput"];
					setErrors({ fieldErrors: invalidInputErr.invalidFields })
					break;
				case AuthLoginReqErrorCodes.IncorrectEmailOrPassword:
					setErrors({ fieldErrors: {}, formError: Loc.Auth.IncorrectEmailOrPassword })
					break;
				default:
			}
		})
	}

	const validateFields = (formData: TFilledFormFields<TLoginFieldId>) => {
		return AuthUtils.ValidateLoginFields(formData);
	}

	return (
		<AuthForm 
			title={Loc.Auth.SignIn}
			fields={loginFields}
			changeFormText={Loc.Auth.NoAccount}
			changeFormLinkText={Loc.Auth.Register}
			switchForm={props.toggleForm}
			onSubmit={handleSubmit} 
			validateFields={validateFields}
			isLoading={isLoading}
		/>
	)
}

const RegisterForm = (props: TFormProps) => {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit: FormSubmissionHandler<TRegistrationFieldId> = (formData, setErrors) => {
		setIsLoading(true);

		APIFetcher.RegisterUser(formData).then((res) => APIFetcher.ResponseHandler(res, () => {
			navigate("/Dashboard", { replace: true });
		})).catch(({ response }: RegisterUserRequest.ErrResponse) => {
			setIsLoading(false);

			const err = response?.data;

			switch (err?.errCode) {
				case AuthRegistrationReqErrorCodes.EmailOrUsernameTaken:
					const credTakenErr = err as RegisterUserRequest.Errors["EmailOrUsernameTaken"];
					setErrors({ fieldErrors: {
						[credTakenErr.credentialTaken]: credTakenErr.credentialTaken === "email" ? Loc.Auth.EmailTaken : Loc.Auth.UsernameTaken 
					}})
					break;
				case AuthRegistrationReqErrorCodes.InvalidFieldInput:
					const invalidFieldErr = err as RegisterUserRequest.Errors["InvalidFieldInput"]
					setErrors({ fieldErrors: invalidFieldErr.invalidFields });
					break;
				default:
					
			}
		})
	}

	const validateFields = (formData: TFilledFormFields<TRegistrationFieldId>) => {
		return AuthUtils.ValidateRegistrationFields(formData);
	}

	return (
		<AuthForm
			isLoading={isLoading}
			title={Loc.Auth.Register}
			fields={registerFields}
			changeFormText={Loc.Auth.AlreadyHaveAccount}
			changeFormLinkText={Loc.Auth.SignIn}
			switchForm={props.toggleForm}
			onSubmit={handleSubmit} 
			validateFields={validateFields}
		/>
	)
}