import classNames from 'classnames';
import React from 'react'
import { useEffect } from 'react';
import { ClassesProp } from '~Utils/Helpers';
import { WindowUtils } from '~Utils/WindowUtils';
import styles from "./Modal.module.scss";

export type ModalProps = {
	show: boolean;
	hide: () => void;
	children: React.ReactNode;
	classes?: ClassesProp<"root" | "overlay" | "contentWrapper">;
	onMouseDown?: () => void;
}

/** Displays a pop-up modal and locks window scroll */
export default function Modal(props: ModalProps) {
	const { show, children, classes, hide, onMouseDown } = props;

	useEffect(() => {
		show ? WindowUtils.lockScroll() : WindowUtils.unlockScroll();
	}, [show])

	return (
		<div className={classNames(styles.modal, classes?.root, show && styles.show)} onMouseDown={onMouseDown}>
			<div className={classNames(styles.overlay, classes?.overlay)} onClick={hide}/>
				{children}
		</div>
	)
}