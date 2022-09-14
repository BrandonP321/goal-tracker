import { TGoalCategory } from "@goal-tracker/shared/src/utils/GoalUtils";
import classNames from "classnames";
import { FormFields, TValidFormField } from "~Components/Form/Form";
import { DangerGradientBtn, GradientBtn } from "~Components/GradientBtn/GradientBtn";
import Modal, { ModalProps } from "~FeatureComponents/Modal/Modal";
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

	const newGoalFields: TValidFormField[] = [
		{ id: "goal-title", name: "title", placeholder: "Title", type: "Input", required: true, errMsg: null },
		{ id: "goal-notes", placeholder: "Notes", type: "Textarea", required: false, errMsg: null, name: "goal-notes" },
		{
			title: "Goal Category",
			options: [
				{ id: "radio-today", title: "Today", value: "today" },
				{ id: "radio-week", title: "Week", value: "week" },
				{ id: "radio-month", title: "Month", value: "month" },
				{ id: "radio-unassigned", title: "Unassigned", value: "unassigned" },
			],
			defaultValue: defaultCategory,
			name: "goal-category",
			errMsg: null,
			type: "Radio",
			id: "goal-category"
		}
	]

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
	}

	return (
		<Modal show={show} hide={hide} classes={{ ...classes, root: classNames(styles.creationModal, classes?.root) }} onMouseDown={onMouseDown}>
			<div className={styles.modalContent}>
				<p className={styles.modalTitle}>Create New Goal</p>
				<form onSubmit={handleSubmit} noValidate>
					<FormFields fields={newGoalFields} errors={{}}/>
					<div className={styles.formBtns}>
						<GradientBtn classes={{ root: styles.submitBtn }}>Create</GradientBtn>
						<DangerGradientBtn classes={{ root: styles.cancelBtn }} onClick={hide}>Cancel</DangerGradientBtn>
					</div>
				</form>
			</div>
		</Modal>
	)
}