import { CreateGoalReqErrorCodes, CreateGoalRequest } from "@goal-tracker/shared/src/api/Requests/Goal";
import { TFilledFormFields } from "@goal-tracker/shared/src/utils/FormUtils";
import { GoalUtils, TGoalCategory, TGoalCreationFieldId } from "@goal-tracker/shared/src/utils/GoalUtils";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormFields, FormSubmissionHandler, TValidFormField, useFormValidationErrors } from "~Components/Form/Form";
import { DangerGradientBtn, GradientBtn } from "~Components/GradientBtn/GradientBtn";
import Modal, { ModalProps } from "~FeatureComponents/Modal/Modal";
import { useAppDispatch } from "~Store/hooks";
import { addGoal } from "~Store/slices/UserGoals/UserGoalsSlice";
import { APIFetcher } from "~Utils/APIFetcher";
import styles from "./GoalCreationModal.module.scss";

type GoalCreationModalProps = {
	show: boolean;
	hide: () => void;
	classes?: ModalProps["classes"];
	defaultCategory?: TGoalCategory;
	onMouseDown?: () => void;
}

export const GoalCreationModal = (props: GoalCreationModalProps) => {
	const { hide, show, classes, defaultCategory, onMouseDown } = props;

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [validationErrors, setValidationErrors] = useFormValidationErrors<TGoalCreationFieldId>();
	const [isLoading, setIsLoading] = useState(false);

	const formRef = useRef<HTMLFormElement | null>(null);

	const newGoalFields: TValidFormField<TGoalCreationFieldId>[] = [
		{ id: "title", name: "title", placeholder: "Title", type: "Input", required: true, errMsg: null, formRef },
		{ id: "notes", placeholder: "Notes", type: "Textarea", required: false, errMsg: null, name: "notes", formRef },
		{
			title: "Goal Category",
			options: [
				{ id: "radio-today", title: "Today", value: "today" },
				{ id: "radio-week", title: "Week", value: "week" },
				{ id: "radio-month", title: "Month", value: "month" },
				{ id: "radio-unassigned", title: "Unassigned", value: "unassigned" },
			],
			defaultValue: defaultCategory,
			name: "category",
			errMsg: null,
			type: "Radio",
			id: "category",
			formRef
		}
	]

	const handleSubmit: FormSubmissionHandler<TGoalCreationFieldId> = (formData, setErrors) => {
		setIsLoading(true);

		APIFetcher.CreateGoal(formData as TFilledFormFields<TGoalCreationFieldId> & { category: TGoalCategory }).then(res => {
			dispatch(addGoal(res.data));
			formRef.current?.reset();
			hide();
		}).catch(errResponse => APIFetcher.ErrHandler<CreateGoalRequest.ErrResponse>(errResponse, navigate, ({ data: err }) => {
			switch (err.errCode) {
				case CreateGoalReqErrorCodes.InvalidFieldInput:
					const invalidFieldErr = err as CreateGoalRequest.Errors["InvalidFieldInput"];
					setErrors({ fieldErrors: invalidFieldErr.invalidFields });
					break;
			}
		})).finally(() => setIsLoading(false))
	}

	const validateFields = (formData: TFilledFormFields<TGoalCreationFieldId>) => {
		return GoalUtils.ValidateGoalCreationFields(formData);
	}

	return (
		<Modal show={show} hide={hide} classes={{ ...classes, root: classNames(styles.creationModal, classes?.root) }} onMouseDown={onMouseDown}>
			<div className={styles.modalContent}>
				<p className={styles.modalTitle}>Create New Goal</p>
				<Form inputRef={formRef} onSubmit={handleSubmit} setValidationErrors={setValidationErrors} validateFields={validateFields}>
					<FormFields fields={newGoalFields} errors={validationErrors.fieldErrors}/>
					<div className={styles.formBtns}>
						<GradientBtn isLoading={isLoading} classes={{ root: styles.submitBtn }}>Create</GradientBtn>
						<DangerGradientBtn classes={{ root: styles.cancelBtn }} onClick={hide} isLoading={isLoading}>Cancel</DangerGradientBtn>
					</div>
				</Form>
			</div>
		</Modal>
	)
}