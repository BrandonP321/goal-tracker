import classNames from "classnames";
import { DarkToColorGradientBtn } from "~Components/GradientBtn/GradientBtn";
import { ClassesProp } from "~Utils/Helpers";
import styles from "./DropdownMenu.module.scss";

export type DropdownMenuProps = {
	options: {
		title: string;
		onClick: (...args: any) => void;
	}[],
	classes?: ClassesProp<"root" | "option">
}

export const DropdownMenu = ({ options, classes }: DropdownMenuProps) => {
	return (
		<div className={classNames(styles.dropdown, classes?.root)}>
			{options?.map((o, i) => {
				return (
					<DarkToColorGradientBtn key={i} classes={{ root: classNames(styles.option, classes?.option) }} onClick={o.onClick}>{o.title}</DarkToColorGradientBtn>
				)
			})}
		</div>
	)
}