import { GoalBoard } from "~Components/GoalBoard/GoalBoard";
import styles from "./GoalsDashboard.module.scss";

type GoalsDashboardProps = {}

export default function GoalsDashboard(props: GoalsDashboardProps) {
  return (
    <div className={styles.dash}>
      <GoalBoard/>
    </div>
  )
}