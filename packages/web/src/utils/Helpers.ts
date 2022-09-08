/** Utility type for annotating type of classes object used to pass classnames through a child element's props */
export type ClassesProp<T extends string> = {
	[key in T]?: string;
}