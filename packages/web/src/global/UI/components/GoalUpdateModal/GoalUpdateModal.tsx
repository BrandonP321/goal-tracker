import { UpdateGoalReqErrorCodes, UpdateGoalRequest } from "@goal-tracker/shared/src/api/Requests/Goal";
import { TFilledFormFields } from "@goal-tracker/shared/src/utils/FormUtils";
import { GoalUtils, TGoal, TGoalCategory, TGoalUpdateFieldId } from "@goal-tracker/shared/src/utils/GoalUtils";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormFields, FormSubmissionHandler, TValidFormField, useFormValidationErrors } from "~Components/Form/Form";
import { DangerGradientBtn, GradientBtn } from "~Components/GradientBtn/GradientBtn";
import Modal, { ModalProps } from "~FeatureComponents/Modal/Modal";
import { useAppDispatch } from "~Store/hooks";
import { addGoal, updateGoal } from "~Store/slices/UserGoals/UserGoalsSlice";
import { APIFetcher } from "~Utils/APIFetcher";
import styles from "./GoalUpdateModal.module.scss";

type GoalUpdateModalProps = {
	show: boolean;
	hide: () => void;
	classes?: ModalProps["classes"];
	goalData: TGoal | null;
	onMouseDown?: () => void;
}

export const GoalUpdateModal = (props: GoalUpdateModalProps) => {
	const { hide, show, classes, onMouseDown, goalData } = props;
	const { category, id, notes, title, isComplete } = goalData ?? {}

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [validationErrors, setValidationErrors] = useFormValidationErrors<TGoalUpdateFieldId>();
	const [isLoading, setIsLoading] = useState(false);

	const formRef = useRef<HTMLFormElement | null>(null);

	const goalFields: TValidFormField<TGoalUpdateFieldId>[] = [
		{ id: "title", name: "title", placeholder: "Title", type: "Input", required: true, errMsg: null, defaultValue: title, formRef },
		{ id: "notes", placeholder: "Notes", type: "Textarea", required: false, errMsg: null, name: "notes", defaultValue: notes, formRef },
	]

	const handleSubmit: FormSubmissionHandler<TGoalUpdateFieldId> = (formData, setErrors) => {
		setIsLoading(true);

		if (!category || !id || isComplete === undefined) {
			return;
		}

		const formDataWithCategory = formData as TFilledFormFields<TGoalUpdateFieldId> & { category: TGoalCategory };

		APIFetcher.UpdateUserGoal({...formDataWithCategory, goalCategory: category, goalId: id}).then((res) => APIFetcher.ResponseHandler(res, () => {
			dispatch(updateGoal({...formDataWithCategory, id, isComplete, category}));
			hide();
		})).catch(errResponse => APIFetcher.ErrHandler<UpdateGoalRequest.ErrResponse>(errResponse, navigate, ({ data: err }) => {
			switch (err.errCode) {
				case UpdateGoalReqErrorCodes.InvalidFieldInput:
					const invalidFieldErr = err as UpdateGoalRequest.Errors["InvalidFieldInput"];
					setErrors({ fieldErrors: invalidFieldErr.invalidFields });
					break;
			}
		})).finally(() => setIsLoading(false))
	}

	const validateFields = (formData: TFilledFormFields<TGoalUpdateFieldId>) => {
		return GoalUtils.ValidateGoalUpdateFields(formData);
	}

	return (
		<Modal show={show} hide={hide} classes={{ ...classes, root: classNames(styles.updateModal, classes?.root) }} onMouseDown={onMouseDown}>
			<div className={styles.modalContent}>
				<p className={styles.modalTitle}>Update Goal</p>
				<Form inputRef={formRef} onSubmit={handleSubmit} setValidationErrors={setValidationErrors} validateFields={validateFields}>
					<FormFields fields={goalFields} errors={validationErrors.fieldErrors}/>
					<div className={styles.formBtns}>
						<GradientBtn isLoading={isLoading} classes={{ root: styles.submitBtn }}>Save</GradientBtn>
						<DangerGradientBtn classes={{ root: styles.cancelBtn }} onClick={hide} isLoading={isLoading} type={"button"}>Cancel</DangerGradientBtn>
					</div>
				</Form>
			</div>
		</Modal>
	)
}