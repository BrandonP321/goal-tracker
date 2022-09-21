import { TAPIRequest } from "@goal-tracker/shared/src/api/Requests";
import { Response } from "express";
import { TRouteController } from "~Controllers/index";
import { ControllerUtils } from "~Utils/ControllerUtils";
import { JWTResLocals, JWTUtils } from "~Utils/JWTUtils";
import db from "../models";

const haveUserReAuth = (res: Response, errMsg?: string) => {
	return ControllerUtils.respondWithUserReAuthErr(res, errMsg);
}

/** Middleware for protected API endpoints.  Authenticates user via JWTs stored in cookies */
export const AuthJwt: TRouteController<TAPIRequest<{}, {}, {}>, JWTResLocals> = async (req, res, next) => {
	try {
		const authTokens = JWTUtils.getTokensFromCookie(req);
	
		// if no tokens found, have user re-auth
		if (!authTokens) {
			return haveUserReAuth(res, "No auth tokens found");
		}
	
		const aToken = JWTUtils.verifyAccessToken(authTokens.aToken);
		const rToken = JWTUtils.verifyRefreshToken(authTokens.rToken);
	
		// if token couldn't be verified or refresh token is expired, have user re-auth
		if (!aToken || !rToken || rToken.isExpired) {
			return haveUserReAuth(res, "Expired refresh token");
		}
		
		// if access token is expired, validate hash id on tokens against token has stored on user's document
		if (aToken.isExpired) {
			const areTokensRefreshed = await refreshTokens(aToken.jwtHash, rToken.jwtHash, rToken.userId, res);
			
			if (!areTokensRefreshed) {
				return haveUserReAuth(res, "Unable to refresh tokens");
			}
		}
	
		// make user's id accessible to other controllers
		res.locals = { userId: aToken.userId }

		next();
	} catch (err) {
		return haveUserReAuth(res, "Unable to validate user authorization");
	}
}

/**
 * Refreshes access & refresh tokens
 * @returns true or false depending on whether tokens were successfully refreshed
 */
const refreshTokens = async (aTokenHash: string, rTokenHash: string, userId: string, res: Response) => {
	try {
		const user = await db.User.findById(userId);

		const isRefreshAllowed = user && (aTokenHash === rTokenHash) && user.jwtHash?.[rTokenHash];
	
		if (!isRefreshAllowed) {
			return false;
		}

		const { tokenHashId, tokens: newTokens } = await JWTUtils.generateAndStoreTokens(userId, res);

		if (!newTokens) {
			return false;
		}
	
		await user.removeJWTHash(rTokenHash);
		await user.addJWTHash(tokenHashId);

		return true;
	} catch (err) {
		return false;
	}
}