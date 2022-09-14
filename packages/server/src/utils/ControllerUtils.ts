import { DefaultReqErrors, TRequestErrBody } from "@goal-tracker/shared/src/api/Requests";
import { Response } from "express";

export class ControllerUtils {
	/** Converts error object into http response, sends JSON to client, and ends connection */
	public static respondWithErr({ defaults, params }: TRequestErrBody, res: Response) {
		res.status(defaults.status).json({ errCode: defaults.errCode, ...params }).end();
	}

	/** Sends 500 status error to client with optional error message */
	public static respondWithUnexpectedErr(res: Response, errMsg?: string) {
		this.respondWithErr(DefaultReqErrors.UnexpectedCondition({ errMsg }), res);
	}
}
