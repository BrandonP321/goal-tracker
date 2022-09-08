import { Responsive } from "~Store/slices/Responsive/Responsive";

export class ReduxUtils {
	/** Initializes any redux data stores that require initialization */
	public static initializeStores = () => {
		Responsive.startDataStoreListeners();
	}

	/** Destroys any redux stores that required initialization */
	public static destroyStores = () => {
		Responsive.destoryStoreListeners();
	}
}