import { useEffect } from "react";
import { GoalBoard } from "~Components/GoalBoard/GoalBoard";
import MainHeader from "~Components/MainHeader/MainHeader";
import { PageHelmet } from "~FeatureComponents/PageHelmet/PageHelmet";
import { APIFetcher } from "~Utils/APIFetcher";
import styles from "./GoalsDashboard.module.scss";

type GoalsDashboardProps = {}

export default function GoalsDashboard(props: GoalsDashboardProps) {

  return (
    <div className={styles.dash}>
      <PageHelmet title={"My Goals"}/>
      <MainHeader />
      <GoalBoard />
    </div>
  )
}