import React, { useEffect, useRef } from 'react'
import { DarkToColorGradientBtn } from '~Components/GradientBtn/GradientBtn';
import { useAppDispatch, useUserGoals } from '~Store/hooks';
import { moveGoal, setGoals, TGoal } from '~Store/slices/UserGoals/UserGoalsSlice';
import { throttle } from '~Utils/Helpers';
import styles from "./GoalsDashboard.module.scss";

const mockGoal: TGoal = {
  title: "This is a goal of mine",
  desc: "This is a very cool goal that I don't have a good description for, but this will work for now",
  isComplete: false,
  category: "today",
  id: ""
}

const mockGoals: TGoal[] = Array(10).fill(mockGoal).map((goal, i) => ({...goal, id: JSON.stringify(i)}));
const todayMockGoals = mockGoals.slice(0, 4);
const weekMockGoals = mockGoals.slice(5, mockGoals.length);

type GoalsDashboardProps = {}

export default function GoalsDashboard(props: GoalsDashboardProps) {
  return (
    <div className={styles.dash}>
      <GoalBoard/>
    </div>
  )
}

type GoalBoardProps = {
}

let throttleWait = false;
const setThrottleWait = (value: boolean) => throttleWait = value;

const GoalBoard = (props: GoalBoardProps) => {
  const dispatch = useAppDispatch();

  const { errorUpdatingGoal, goals, haveGoalsLoaded } = useUserGoals();

  const {} = props;

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

  return (
    <div 
      ref={boardRef}
      className={styles.board} 
      onMouseDown={handleBoardMouseDown}
      onMouseUp={resetDragSettings}
      onMouseMove={(e) => throttle(() => handleMouseDrag(e), 1000 / 90, throttleWait, setThrottleWait)}
    >
      <GoalList goals={goals.today} title={"Today's Goals"} onCardMouseDown={resetDragSettings}/>
      <GoalList goals={goals.week} title={"Week's Goals"} onCardMouseDown={resetDragSettings} />
      <GoalList goals={goals.month} title={"Month's Goals"} onCardMouseDown={resetDragSettings} />
      <GoalList goals={goals.unassigned} title={"Unassigned Goals"} onCardMouseDown={resetDragSettings} />
    </div>
  )
}

type GoalListProps = {
  goals: TGoal[];
  title: string;
  onCardMouseDown: () => void;
}

const GoalList = (props: GoalListProps) => {
  const { goals, title, onCardMouseDown } = props;

  return (
    <div className={styles.goalList}>
      <p className={styles.listTitle}>{title}</p>
      <div className={styles.listGoals}>
        {goals?.map((g, i) => (
          <GoalCard {...g} key={i} onMouseDown={onCardMouseDown}/>
        ))}
      </div>
      <DarkToColorGradientBtn>Create New Goal</DarkToColorGradientBtn>
    </div>
  )
}

type GoalCardProps = TGoal & {
  onMouseDown: () => void;
}

const GoalCard = (props: GoalCardProps) => {
  const { title, desc, category, isComplete, onMouseDown, id } = props;

  const dispatch = useAppDispatch();

  const handleCardListChange = () => {
    dispatch(moveGoal({ currentCategory: "today", goalId: id, newCategory: "week" }))
  }

  return (
    <div className={styles.goalCard} onMouseDown={onMouseDown} onClick={handleCardListChange}>
      <div className={styles.toolbar}>

      </div>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardBlurb}>{desc}</p>
    </div>
  )
}