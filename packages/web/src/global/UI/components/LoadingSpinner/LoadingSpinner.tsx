import classNames from 'classnames';
import React from 'react'
import { ClassesProp } from '~Utils/Helpers';
import styles from "./LoadingSpinner.module.scss";

type LoadingSpinnerProps = {
	show: boolean;
	classes?: ClassesProp<"spinner" | "show">;
}

export default function LoadingSpinner({ show, classes }: LoadingSpinnerProps) {

	return (
		<div className={classNames(styles.spinner, classes?.spinner, show && styles.show, show && classes?.show)} />
	)
}