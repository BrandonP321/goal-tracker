/** Utility type for annotating type of classes object used to pass classnames through a child element's props */
export type ClassesProp<T extends string> = {
	[key in T]?: string;
}

/**
 * Throttles rate at which a callback function can be called
 * @param cb Callback function
 * @param interval How often callback can be called
 * @param wait if false, callback can't be executed yet
 * @param setWait updates 'wait' value
 */
export const throttle = (cb: (...args: any) => void, interval: number, wait: boolean, setWait: (value: boolean) => void) => {
	if (!wait) {
		requestAnimationFrame(cb);

		setWait(true);

		setTimeout(() => {
			setWait(false);
		}, interval)
	}
}