import { faArrowTurnDownRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuProps } from "~Components/DropdownMenu/DropdownMenu";
import { useAppDispatch } from "~Store/hooks";
import { moveGoal } from "~Store/slices/UserGoals/UserGoalsSlice";
import styles from "./GoalCard.module.scss";
import { GoalUtils, TGoal } from "@goal-tracker/shared/src/utils/GoalUtils";
import { APIFetcher } from "~Utils/APIFetcher";

type GoalCardProps = TGoal & {
	onMouseDown: () => void;
}

export const GoalCard = (props: GoalCardProps) => {
	const { title, notes, category, isComplete, onMouseDown, id } = props;

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

	return (
		<div className={styles.goalCard} onMouseDown={onMouseDown}>
			<div className={styles.toolbar}>
				<div className={styles.toolIconWrapper} onClick={toggleMoveDropdownVisibility}>
					<FontAwesomeIcon icon={faArrowTurnDownRight} className={styles.toolIcon} />
					<DropdownMenu options={moveDropdownOptions} classes={{ root: classNames(styles.goalMoveDropdown, showMoveDropdown && styles.show) }} />
				</div>
			</div>
			<p className={styles.cardTitle}>{title}</p>
			<p className={styles.cardBlurb}>{notes}</p>
		</div>
	)
}