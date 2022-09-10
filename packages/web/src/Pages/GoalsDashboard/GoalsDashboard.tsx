import { faArrowTurnDownRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react'
import { DarkToColorGradientBtn, GradientBtn } from '~Components/GradientBtn/GradientBtn';
import { useAppDispatch, useUserGoals } from '~Store/hooks';
import { moveGoal, setGoals } from '~Store/slices/UserGoals/UserGoalsSlice';
import { GoalUtils, TGoal, TGoalCategory } from '~Utils/GoalUtils';
import { ClassesProp, throttle } from '~Utils/Helpers';
import styles from "./GoalsDashboard.module.scss";

const mockGoal: TGoal = {
  title: "This is a goal of mine",
  desc: "This is a very cool goal that I don't have a good description for, but this will work for now",
  isComplete: false,
  category: "today",
  id: ""
}

const mockGoals: TGoal[] = Array(10).fill(mockGoal).map((goal, i) => ({...goal, id: JSON.stringify(i), title: goal.title + " " + i}));
const todayMockGoals = mockGoals.slice(0, 4);
const weekMockGoals: TGoal[] = mockGoals.slice(5, mockGoals.length)?.map(goal => ({ ...goal, category: "week" }));

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
      <GradientBtn>Create New Goal</GradientBtn>
    </div>
  )
}

type GoalCardProps = TGoal & {
  onMouseDown: () => void;
}

const GoalCard = (props: GoalCardProps) => {
  const { title, desc, category, isComplete, onMouseDown, id } = props;

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
      },
    })))

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
          <FontAwesomeIcon icon={faArrowTurnDownRight} className={styles.toolIcon}/>
          <DropdownMenu options={moveDropdownOptions} classes={{ root: classNames(styles.goalMoveDropdown, showMoveDropdown && styles.show) }}/>
        </div>
      </div>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardBlurb}>{desc}</p>
    </div>
  )
}

export type DropdownMenuProps = {
  options: {
    title: string;
    onClick: (...args: any) => void;
  }[],
  classes?: ClassesProp<"root" | "option">
}

const DropdownMenu = ({ options, classes }: DropdownMenuProps) => {
  return (
    <div className={classNames(styles.dropdown, classes?.root)}>
      {options?.map((o, i) => {
        return (
          // <div className={classNames(styles.option, classes?.option)} onClick={o.onClick}>{o.title}</div>
          <DarkToColorGradientBtn key={i} classes={{ root: classNames(styles.option, classes?.option) }} onClick={o.onClick}>{o.title}</DarkToColorGradientBtn>
        )
      })}
    </div>
  )
}