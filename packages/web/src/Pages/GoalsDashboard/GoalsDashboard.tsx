import { faArrowTurnDownRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react'
import { FormFields, TValidFormField } from '~Components/Form/Form';
import { GoalBoard } from '~Components/GoalBoard/GoalBoard';
import { GoalCreationModal } from '~Components/GoalCreationModal/GoalCreationModal';
import { DangerGradientBtn, DarkToColorGradientBtn, GradientBtn } from '~Components/GradientBtn/GradientBtn';
import Modal, { ModalProps } from '~FeatureComponents/Modal/Modal';
import { useAppDispatch, useUserGoals } from '~Store/hooks';
import { moveGoal, setGoals } from '~Store/slices/UserGoals/UserGoalsSlice';
import { GoalUtils, TGoal, TGoalCategory } from '~Utils/GoalUtils';
import { ClassesProp, throttle } from '~Utils/Helpers';
import styles from "./GoalsDashboard.module.scss";

type GoalsDashboardProps = {}

export default function GoalsDashboard(props: GoalsDashboardProps) {
  return (
    <div className={styles.dash}>
      <GoalBoard/>
    </div>
  )
}