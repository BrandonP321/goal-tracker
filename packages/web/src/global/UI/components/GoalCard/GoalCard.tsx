import { faArrowTurnDownRight, faCheckDouble, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuProps } from "~Components/DropdownMenu/DropdownMenu";
import { useAppDispatch } from "~Store/hooks";
import { moveGoal, removeGoal, updateGoal } from "~Store/slices/UserGoals/UserGoalsSlice";
import styles from "./GoalCard.module.scss";
import { GoalUtils, TGoal } from "@goal-tracker/shared/src/utils/GoalUtils";
import { APIFetcher } from "~Utils/APIFetcher";
import { useNavigate } from "react-router-dom";
import { DeleteGoalReqErrorCodes, DeleteGoalRequest, UpdateGoalReqErrorCodes, UpdateGoalRequest } from "@goal-tracker/shared/src/api/Requests/Goal";

type GoalCardProps = TGoal & {
	onMouseDown: () => void;
}

export const GoalCard = (props: GoalCardProps) => {
	const { title, notes, category, isComplete, onMouseDown, id } = props;

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [moveDropdownOptions, setMoveDropdownOptions] = useState<DropdownMenuProps["options"]>([]);
	const [showMoveDropdown, setShowMoveDropdown] = useState(false);

	useEffect(() => {
		const validCategoryMoves = GoalUtils.getValidCategoriesForMove(category);

		setMoveDropdownOptions(validCategoryMoves?.map(cat => ({
			title: GoalUtils.CategoryNames[cat],
			onClick: () => {
				dispatch(moveGoal({ currentCategory: category, goalId: id, newCategory: cat }))
				setShowMoveDropdown(false);

				APIFetcher.UpdateUserGoal({ goalId: id, goalCategory: category, category: cat }).then(res => {
					console.log(res.data);
				}).catch(({ data }) => {
					console.log(data);
				})
			},
		})));

		const hideDropdown = () => setShowMoveDropdown(false);

		document.addEventListener("click", hideDropdown);

		return () => document.removeEventListener("click", hideDropdown);
	}, [setShowMoveDropdown, category, id, dispatch])

	const toggleMoveDropdownVisibility = () => {
		requestAnimationFrame(() => {
			setShowMoveDropdown(!showMoveDropdown);
		})
	}

	const handleDeleteIconClick = () => {
		dispatch(removeGoal({ category, id, isComplete, notes, title }));

		APIFetcher.DeleteGoal({ goalIdURI: encodeURIComponent(id), goalCategoryURI: encodeURIComponent(category) })
			.catch((errResponse) => APIFetcher.ErrHandler<DeleteGoalRequest.ErrResponse>(errResponse, navigate, ({ data: err }) => {
				console.log(err);
				switch (err.errCode) {
					case DeleteGoalReqErrorCodes.GoalNotFound:
					case DeleteGoalReqErrorCodes.MissingGoalIdOrCategory:
						break;
				}
			}))
	}

	const handleCompletionIconClick = () => {
		dispatch(updateGoal({ id, category, isComplete: !isComplete, notes, title }))

		APIFetcher.UpdateUserGoal({
			isComplete: isComplete ? "false" : "true",
			goalCategory: category,
			goalId: id
		}).catch((errResponse) => APIFetcher.ErrHandler<UpdateGoalRequest.ErrResponse>(errResponse, navigate, ({ data: err }) => {
			switch (err.errCode) {
				case UpdateGoalReqErrorCodes.GoalNotFound:
				case UpdateGoalReqErrorCodes.InvalidFieldInput:
				case UpdateGoalReqErrorCodes.MissingGoalIdOrCategory:
					break;
			}
		}))
	}

	return (
		<div className={styles.goalCard} onMouseDown={onMouseDown}>
			<div className={styles.toolbar}>
				<div className={styles.toolIconWrapper} onClick={toggleMoveDropdownVisibility}>
					<FontAwesomeIcon icon={faArrowTurnDownRight} className={classNames(styles.toolIcon, styles.arrow)} />
					<DropdownMenu options={moveDropdownOptions} classes={{ root: classNames(styles.goalMoveDropdown, showMoveDropdown && styles.show) }} />
				</div>
				<div className={styles.toolIconWrapper} onClick={handleDeleteIconClick}>
					<FontAwesomeIcon icon={faTrash} className={classNames(styles.toolIcon, styles.trash)} />
				</div>
				<div className={styles.toolIconWrapper} onClick={handleCompletionIconClick}>
					<FontAwesomeIcon icon={faCheckDouble} className={classNames(styles.toolIcon, styles.check, isComplete && styles.complete)} />
				</div>
			</div>
			<p className={styles.cardTitle}>{title}</p>
			<p className={styles.cardBlurb}>{notes}</p>
		</div>
	)
}