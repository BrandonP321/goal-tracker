import classNames from 'classnames';
import React from 'react'
import { ClassesProp } from '~Utils/Helpers';
import styles from "./LoadingSpinner.module.scss";

type LoadingSpinnerProps = {
	show: boolean;
	classes?: ClassesProp<"root" | "show">;
}

export default function LoadingSpinner({ show, classes }: LoadingSpinnerProps) {

	return (
		<div className={classNames(styles.spinnerWrapper, classes?.root, show && classNames(styles.show, classes?.show))}>
			<div className={classNames(styles.ball, styles.pink)}/>
			<div className={styles.blackBallWrapper}>
				<div className={classNames(styles.ball, styles.black)}/>
			</div>
		</div>
	)
}