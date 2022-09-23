import { faArrowTurnDownRight, faCheckDouble, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useState, useEffect } from "react";
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
	showGoalUpdateModal: (goal: TGoal) => void;
}

export const GoalCard = (props: GoalCardProps) => {
	const { title, notes, category, isComplete, onMouseDown, showGoalUpdateModal, id } = props;

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	/** Valid categories goal can be moved to */
	const [moveDropdownOptions, setMoveDropdownOptions] = useState<DropdownMenuProps["options"]>([]);
	const [showMoveDropdown, setShowMoveDropdown] = useState(false);

	useEffect(() => {
		const validCategoryMoves = GoalUtils.getValidCategoriesForMove(category);

		setMoveDropdownOptions(validCategoryMoves?.map(cat => ({
			title: GoalUtils.CategoryNames[cat],
			onClick: () => {
				dispatch(moveGoal({ currentCategory: category, goalId: id, newCategory: cat }))
				setShowMoveDropdown(false);

				APIFetcher.UpdateUserGoal({ goalId: id, goalCategory: category, category: cat }).then((res) => APIFetcher.ResponseHandler(res, () => {
					console.log(res.data);
				})).catch((errResponse) => APIFetcher.ErrHandler<UpdateGoalRequest.ErrResponse>(errResponse, navigate, ({ data: err }) => {
					console.log(err);
				}))
			},
		})));

		const hideDropdown = () => setShowMoveDropdown(false);

		document.addEventListener("click", hideDropdown);

		return () => document.removeEventListener("click", hideDropdown);
	}, [setShowMoveDropdown, category, id, dispatch])

	const toggleMoveDropdownVisibility = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();

		requestAnimationFrame(() => {
			setShowMoveDropdown(!showMoveDropdown);
		})
	}

	const handleDeleteIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();

		dispatch(removeGoal({ category, id, isComplete, notes, title }));

		APIFetcher.DeleteGoal({ goalIdURI: encodeURIComponent(id), goalCategoryURI: encodeURIComponent(category) })
			.then(res => APIFetcher.ResponseHandler(res))
			.catch((errResponse) => APIFetcher.ErrHandler<DeleteGoalRequest.ErrResponse>(errResponse, navigate, ({ data: err }) => {
				switch (err.errCode) {
					case DeleteGoalReqErrorCodes.GoalNotFound:
					case DeleteGoalReqErrorCodes.MissingGoalIdOrCategory:
						break;
				}
			}))
	}

	const handleCompletionIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();

		dispatch(updateGoal({ id, category, isComplete: !isComplete, notes, title }))

		APIFetcher.UpdateUserGoal({
			isComplete: isComplete ? "false" : "true",
			goalCategory: category,
			goalId: id
		})
			.then((res) => APIFetcher.ResponseHandler(res))
			.catch((errResponse) => APIFetcher.ErrHandler<UpdateGoalRequest.ErrResponse>(errResponse, navigate, ({ data: err }) => {
				switch (err.errCode) {
					case UpdateGoalReqErrorCodes.GoalNotFound:
					case UpdateGoalReqErrorCodes.InvalidFieldInput:
					case UpdateGoalReqErrorCodes.MissingGoalIdOrCategory:
						break;
				}
			}))
	}

	const handleClick = () => {
		showGoalUpdateModal({ id, category, isComplete, notes, title })
	}

	return (
		<div className={styles.goalCard} onMouseDown={onMouseDown} onClick={handleClick}>
			<div className={styles.toolbar}>
				<div className={styles.toolIconWrapper} onClick={toggleMoveDropdownVisibility}>
					<GoalCardIconTooltip>Move</GoalCardIconTooltip>
					<FontAwesomeIcon icon={faArrowTurnDownRight} className={classNames(styles.toolIcon, styles.arrow)} />
					<DropdownMenu options={moveDropdownOptions} classes={{ root: classNames(styles.goalMoveDropdown, showMoveDropdown && styles.show) }} />
				</div>
				<div className={styles.toolIconWrapper} onClick={handleDeleteIconClick}>
					<GoalCardIconTooltip>Delete</GoalCardIconTooltip>
					<FontAwesomeIcon icon={faTrash} className={classNames(styles.toolIcon, styles.trash)} />
				</div>
				<div className={styles.toolIconWrapper} onClick={handleCompletionIconClick}>
					<GoalCardIconTooltip>{isComplete ? "Complete" : "Incomplete"}</GoalCardIconTooltip>
					<FontAwesomeIcon icon={faCheckDouble} className={classNames(styles.toolIcon, styles.check, isComplete && styles.complete)} />
				</div>
			</div>
			<p className={styles.cardTitle}>{title}</p>
			<p className={styles.cardBlurb}>{notes}</p>
		</div>
	)
}

type GoalCardIconTooltipProps = {
	children: React.ReactNode;
}

/** Tooltip to be displayed above each icon on hover */
const GoalCardIconTooltip = (props: GoalCardIconTooltipProps) => {
	return (
		<div className={styles.iconHelper}>
			{props.children}
		</div>
	)
}