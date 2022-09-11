import { useEffect, useRef, useState } from "react";
import { GoalCard } from "~Components/GoalCard/GoalCard";
import { GoalCreationModal } from "~Components/GoalCreationModal/GoalCreationModal";
import { GradientBtn } from "~Components/GradientBtn/GradientBtn";
import { useAppDispatch, useUserGoals } from "~Store/hooks";
import { setGoals } from "~Store/slices/UserGoals/UserGoalsSlice";
import { TGoal, TGoalCategory } from "~Utils/GoalUtils";
import { throttle } from "~Utils/Helpers";
import styles from "./GoalBoard.module.scss";

const mockGoal: TGoal = {
	title: "This is a goal of mine",
	desc: "This is a very cool goal that I don't have a good description for, but this will work for now",
	isComplete: false,
	category: "today",
	id: ""
}

const mockGoals: TGoal[] = Array(10).fill(mockGoal).map((goal, i) => ({ ...goal, id: JSON.stringify(Math.random()), title: goal.title }));
const todayMockGoals = mockGoals.slice(0, 4);
const weekMockGoals: TGoal[] = mockGoals.slice(5, mockGoals.length)?.map(goal => ({ ...goal, category: "week" }));

type GoalBoardProps = {

}

let throttleWait = false;
const setThrottleWait = (value: boolean) => throttleWait = value;

export const GoalBoard = (props: GoalBoardProps) => {
	const dispatch = useAppDispatch();

	const { errorUpdatingGoal, goals, haveGoalsLoaded } = useUserGoals();

	const isMouseDownRef = useRef(false);
	const lastMousePos = useRef<number | null>(null);
	const boardRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		dispatch(setGoals({ month: [], week: weekMockGoals, today: todayMockGoals, unassigned: [] }))
	}, [])

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
			onMouseMove={(e) => throttle(() => handleMouseDrag(e), 1000 / 90, throttleWait, setThrottleWait)}
		>
			{goalLists?.map((g, i) => (
				<GoalList key={i} goals={g.goals} title={g.title} preventMouseScroll={resetDragSettings} category={g.category} />
			))}

		</div>
	)
}

type GoalListProps = {
	goals: TGoal[];
	title: string;
	category: TGoalCategory;
	preventMouseScroll: () => void;
}

const GoalList = (props: GoalListProps) => {
	const { goals, title, preventMouseScroll, category } = props;

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
						<GoalCard {...g} key={i} onMouseDown={preventMouseScroll} />
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