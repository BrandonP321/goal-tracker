import { GetUserGoalsRequest } from "@goal-tracker/shared/src/api/Requests/Goal/Goal.requests";
import { TGoal, TGoalCategory } from "@goal-tracker/shared/src/utils/GoalUtils";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoalCard } from "~Components/GoalCard/GoalCard";
import { GoalCreationModal } from "~Components/GoalCreationModal/GoalCreationModal";
import { GoalUpdateModal } from "~Components/GoalUpdateModal/GoalUpdateModal";
import { GradientBtn } from "~Components/GradientBtn/GradientBtn";
import { useAppDispatch, useResponsive, useUserGoals } from "~Store/hooks";
import { hideLoadingSpinner, showLoadingSpinner } from "~Store/slices/PageLoading/PageLoadingSlice";
import { setUser } from "~Store/slices/User/UserSlice";
import { setGoals } from "~Store/slices/UserGoals/UserGoalsSlice";
import { APIFetcher } from "~Utils/APIFetcher";
import { throttle } from "~Utils/Helpers";
import styles from "./GoalBoard.module.scss";

type GoalBoardProps = {

}

/* 'wait' status of throttle function for mouse drag on board */
let throttleWait = false;
const setThrottleWait = (value: boolean) => throttleWait = value;

/** Board with lists for each goal category */
export const GoalBoard = (props: GoalBoardProps) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const mobile = useResponsive("mobile");

	const { errorUpdatingGoal, goals, haveGoalsLoaded } = useUserGoals();

	const [goalUpdateModalData, setGoalUpdateModalData] = useState<null | TGoal>(null);
	const [showGoalUpdateModalState, setShowGoalUpdateModalState] = useState(false);

	const isMouseDownRef = useRef(false);
	const lastMousePos = useRef<number | null>(null);
	const boardRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		dispatch(showLoadingSpinner());

		APIFetcher.GetFullUser({}).then((res) => APIFetcher.ResponseHandler(res, () => {
			const { goals, username, id } = res.data;

			dispatch(setGoals(goals));
			dispatch(setUser({ username, id }));
			dispatch(hideLoadingSpinner());
		})).catch(APIError => {
			APIFetcher.ErrHandler<GetUserGoalsRequest.ErrResponse>(APIError, navigate, ((err) => {
		}))})
	}, [])

	const showGoalUpdateModal = (goal: TGoal) => {
		setGoalUpdateModalData(goal);
		setShowGoalUpdateModalState(true);
	}

	const hideGoalUpdateModal = (e?: React.MouseEvent<HTMLButtonElement>) => {
		setShowGoalUpdateModalState(false);
	}

	/** Scrolls board on mouse click & drag */
	const handleMouseDrag: React.MouseEventHandler<HTMLDivElement> = (e) => {
		if (!isMouseDownRef.current || lastMousePos.current === null || !boardRef.current) {
			return;
		}

		const mouseX = e.nativeEvent.x;
		const prevX = lastMousePos.current;
		const currentScrollPos = boardRef.current?.scrollLeft;

		const xOffset = mouseX - prevX
		boardRef.current.scrollTo({ left: currentScrollPos - xOffset });

		lastMousePos.current = mouseX;
	}

	/** Unallows scrolling of board via mouse drag */
	const resetDragSettings = () => {
		requestAnimationFrame(() => {
			isMouseDownRef.current = false
			lastMousePos.current = null;
		})
	}

	const handleBoardMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
		isMouseDownRef.current = true;
		lastMousePos.current = e.nativeEvent.x;
	}

	if (!goals) {
		return null;
	}

	const goalLists: { goals: TGoal[]; title: string; category: TGoalCategory }[] = [
		{ goals: goals.today, title: "Today's Goals", category: "today" },
		{ goals: goals.week, title: "Week's Goals", category: "week" },
		{ goals: goals.month, title: "Month's Goals", category: "month" },
		{ goals: goals.unassigned, title: "Unassigned Goals", category: "unassigned" },
	]

	return (
		<div
			ref={boardRef}
			className={styles.board}
			onMouseDown={handleBoardMouseDown}
			onMouseUp={resetDragSettings}
			onMouseMove={!mobile ? ((e) => throttle(() => handleMouseDrag(e), 1000 / 90, throttleWait, setThrottleWait)) : undefined}
		>
			{goalLists?.map((g, i) => (
				<GoalList key={i} goals={g.goals} title={g.title} showGoalUpdateModal={showGoalUpdateModal} preventMouseScroll={resetDragSettings} category={g.category} />
			))}
			<GoalUpdateModal goalData={goalUpdateModalData} show={showGoalUpdateModalState} hide={hideGoalUpdateModal} classes={{}} onMouseDown={resetDragSettings}/>
		</div>
	)
}

type GoalListProps = {
	goals: TGoal[];
	title: string;
	category: TGoalCategory;
	preventMouseScroll: () => void;
	showGoalUpdateModal: (goal: TGoal) => void;
}

const GoalList = (props: GoalListProps) => {
	const { goals, title, preventMouseScroll, category, showGoalUpdateModal } = props;

	const [creationModalData, setCreationModalData] = useState<null | { category: TGoalCategory }>(null);

	const showCreationModal = () => {
		setCreationModalData({ category })
	}

	const hideCreationModal = () => {
		setCreationModalData(null);
	}

	return (
		<>
			<div className={styles.goalList}>
				<p className={styles.listTitle}>{title}</p>
				<div className={styles.listGoals}>
					{goals?.map((g, i) => (
						<GoalCard {...g} key={i} showGoalUpdateModal={showGoalUpdateModal} onMouseDown={preventMouseScroll} />
					))}
				</div>
				<GradientBtn onClick={showCreationModal} classes={{ root: styles.createBtn }}>Create New Goal</GradientBtn>
			</div>

			<GoalCreationModal
				show={!!creationModalData}
				hide={hideCreationModal}
				classes={{ root: styles.creationModal }}
				defaultCategory={category}
				onMouseDown={preventMouseScroll}
			/>
		</>
	)
}