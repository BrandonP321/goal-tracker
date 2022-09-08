import { breakpointHit, ResponsiveState } from "./ResponsiveSlice";
import { ReduxStoreWithSlice, store } from "~Store/store";

class MediaQuery {
	private _maxWidth;
	private _query;
	public lastMatchValue = false;

	public get query() { return this._query };

	public get maxWidth() { return this._maxWidth };

	constructor(maxWidth: number) {
		this._maxWidth = maxWidth;
		this._query = window.matchMedia(`screen and (max-width: ${maxWidth}px)`);
	}

	public testQuery = () => {
		return this._query.matches;
	}

	public updateLastMatchValued = (matches: boolean) => {
		this.lastMatchValue = matches;
	}
};

/**
 * Handles logic for keeping track of media query breakpoints and updating redux store 
 * to reflect which breakpoints are true
 */
export class Responsive {
	/* redux store instanced passed in to constructor */
	private static store = store;

	/* All media queries */
	private static queries: { [key in keyof ResponsiveState]: MediaQuery } = {
		max: new MediaQuery(1664),
		large: new MediaQuery(1200),
		medium: new MediaQuery(992),
		mobile: new MediaQuery(768),
		tiny: new MediaQuery(480),
		pico: new MediaQuery(350),
	}

	/* getters to quickly return a boolean value of whether the media query is valid */
	public static get max() { return this.queries.max.testQuery() };
	public static get large() { return this.queries.large.testQuery() };
	public static get medium() { return this.queries.medium.testQuery() };
	public static get mobile() { return this.queries.mobile.testQuery() };
	public static get tiny() { return this.queries.tiny.testQuery() };
	public static get pcio() { return this.queries.pico.testQuery() };

	/* Adds resize event listener to window to check media query responsiveness */
	private static addMediaQueryListeners = () => {
		// make initial check on all queries
		this.checkMediaQueries();

		window.addEventListener("resize", this.checkMediaQueries)
	}

	/* Checks all media queries and dispatches any changed breakpoints to redux store */
	private static checkMediaQueries = () => {
		let queryKey: keyof typeof this.queries;
		for (queryKey in this.queries) {
			const mq = this.queries[queryKey];

			const matches = mq.query.matches;

			// if boolean match value of query has changed, dispatch new value to redux state
			if (matches !== mq.lastMatchValue) {
				this.handleMediaQueryChange({ breakpoint: queryKey, matches });
				// update matches value on MediaQuery
				mq.updateLastMatchValued(matches);
			}
		}
	}

	/* Dispatches new media query match boolean value to redux state */
	private static handleMediaQueryChange = ({ breakpoint, matches }: { breakpoint: keyof ResponsiveState, matches: boolean }) => {
		this.store.dispatch(breakpointHit({ breakpoint, matches }))
	}

	public static startDataStoreListeners = () => {
		this.addMediaQueryListeners();
	}

	public static destoryStoreListeners = () => {
		window.removeEventListener("resize", this.checkMediaQueries)
	}
}

