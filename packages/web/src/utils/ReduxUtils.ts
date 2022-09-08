import { Responsive } from "~Store/slices/Responsive/Responsive";

export class ReduxUtils {
	public static initializeStores = () => {
		console.log("start")
		Responsive.startDataStoreListeners();
	}

	public static destroyStores = () => {
		console.log("destroy")
		Responsive.destoryStoreListeners();
	}
}