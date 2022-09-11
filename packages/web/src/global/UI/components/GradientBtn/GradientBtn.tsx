import classNames from "classnames";
import { ClassesProp } from "~Utils/Helpers";
import styles from "./GradientBtn.module.scss";

type GradientBtnProps = {
	children?: React.ReactNode;
	onClick?: () => void;
	classes?: ClassesProp<"root">
}

export const GradientBtn = (props: GradientBtnProps) => {
	const { children, classes, onClick } = props;

	return (
		<button onClick={onClick} className={classNames(styles.gradientBtn, classes?.root)}>{children}</button>
	)
}

export const DarkToColorGradientBtn = (props: GradientBtnProps) => {
	const { classes, children, ...rest } = props;

	return (
		<GradientBtn {...rest} classes={{ root: classNames(styles.darkToColorBtn, classes?.root) }}><p>{children}</p></GradientBtn>
	)
}

export const DangerGradientBtn = (props: GradientBtnProps) => {
	const { classes, children, ...rest } = props;

	return (
		<GradientBtn {...rest} classes={{ root: classNames(styles.dangerBtn, classes?.root) }}><p>{children}</p></GradientBtn>
	)
}