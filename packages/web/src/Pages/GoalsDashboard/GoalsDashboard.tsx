import React, { useEffect, useRef } from 'react'
import { DarkToColorGradientBtn } from '~Components/GradientBtn/GradientBtn';
import { throttle } from '~Utils/Helpers';
import styles from "./GoalsDashboard.module.scss";

type TGoalCategory = "today" | "week" | "month" | "unassigned"

type TGoal = {
  title: string;
  desc: string;
  isComplete: boolean;
  category: TGoalCategory;
}

const mockGoal: TGoal = {
  title: "This is a goal of mine",
  desc: "This is a very cool goal that I don't have a good description for, but this will work for now",
  isComplete: false,
  category: "today"
}

const mockGoals = Array(10).fill(mockGoal);

type GoalsDashboardProps = {}

export default function GoalsDashboard(props: GoalsDashboardProps) {
  return (
    <div className={styles.dash}>
      <GoalBoard todayGoals={mockGoals} weekGoals={[]} monthGoals={[]} unassignedGoals={[]} />
    </div>
  )
}

type GoalBoardProps = {
  todayGoals: TGoal[];
  weekGoals: TGoal[];
  monthGoals: TGoal[];
  unassignedGoals: TGoal[];
}

let throttleWait = false;
const setThrottleWait = (value: boolean) => throttleWait = value;

const GoalBoard = (props: GoalBoardProps) => {
  const { monthGoals, todayGoals, unassignedGoals, weekGoals } = props;

  const isMouseDownRef = useRef(false);
  const lastMousePos = useRef<number | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div 
      ref={boardRef}
      className={styles.board} 
      onMouseDown={handleBoardMouseDown}
      onMouseUp={resetDragSettings}
      onMouseMove={(e) => throttle(() => handleMouseDrag(e), 1000 / 90, throttleWait, setThrottleWait)}
    >
      <GoalList goals={todayGoals} title={"Today's Goals"} onCardClick={resetDragSettings}/>
      <GoalList goals={weekGoals} title={"Today's Goals"} onCardClick={resetDragSettings} />
      <GoalList goals={monthGoals} title={"Today's Goals"} onCardClick={resetDragSettings} />
      <GoalList goals={unassignedGoals} title={"Today's Goals"} onCardClick={resetDragSettings} />
    </div>
  )
}

type GoalListProps = {
  goals: TGoal[];
  title: string;
  onCardClick: () => void;
}

const GoalList = (props: GoalListProps) => {
  const { goals, title, onCardClick } = props;

  return (
    <div className={styles.goalList}>
      <p className={styles.listTitle}>{title}</p>
      <div className={styles.listGoals}>
        {goals?.map((g, i) => (
          <GoalCard {...g} key={i} onClick={onCardClick}/>
        ))}
      </div>
      <DarkToColorGradientBtn>Create New Goal</DarkToColorGradientBtn>
    </div>
  )
}

type GoalCardProps = TGoal & {
  onClick: () => void;
}

const GoalCard = (props: GoalCardProps) => {
  const { title, desc, category, isComplete, onClick } = props;

  return (
    <div className={styles.goalCard} onMouseDown={onClick}>
      <div className={styles.toolbar}>

      </div>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardBlurb}>{desc}</p>
    </div>
  )
}