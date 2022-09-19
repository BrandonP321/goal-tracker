import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { ClassesProp } from "~Utils/Helpers";
import styles from "./GradientBtn.module.scss";

type GradientBtnProps = {
	children?: React.ReactNode;
	onClick?: () => void;
	classes?: ClassesProp<"root">
	/** Shows loading spinner instead of text if true and disables button */
	isLoading?: boolean;
	disabled?: boolean;
}

export const GradientBtn = (props: GradientBtnProps) => {
	const { children, classes, onClick, isLoading, disabled } = props;

	return (
		<button 
			onClick={onClick} 
			className={classNames(styles.gradientBtn, classes?.root)}
			disabled={isLoading || disabled}
		>
			{!isLoading && children}
			{isLoading && 
				<FontAwesomeIcon icon={faSpinnerThird} className={styles.spinner}/>
			}
		</button>
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