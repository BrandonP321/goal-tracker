import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";
import bcrypt from "bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { ENVUtils } from "./ENVUtils";

type TAuthTokens = {
	aToken: string;
	rToken: string;
}

export class JWTUtils {
	/** Returns random hash */
	public static generateHash = async () => {
		// generate hash without any periods to avoid problems accessing objects with hash as they key
		return ((await bcrypt.hash(ENVUtils.Vars.SECRET, 10)).replace(/\./g, ""))
	}

	/** Stores access & refresh tokens in http secured cookies */
	public static generateTokenCookies = (tokens: TAuthTokens, res: Response) => {
		res.cookie("authTokens", JSON.stringify(tokens), {
			secure: ENVUtils.isLiveEnv,
			httpOnly: true
		})
	}

	/** Returns access & refresh tokens */
	public static generateTokens = (userId: string, tokenHashId: string) => {
		try {
			const aToken = this.getSignedAccessToken(userId, tokenHashId);
			const rToken = this.getSignedRefreshToken(userId, tokenHashId);
	
			return { aToken, rToken }
		} catch (err) {
			return undefined;
		}
	}

	public static getSignedAccessToken = (userId: string, tokenIdHash: string) => {
		return this.signToken(userId, ENVUtils.Vars.ACCESS_TOKEN_SECRET, tokenIdHash, ENVUtils.Vars.ACCESS_TOKEN_EXPIRES_IN)
	}

	public static getSignedRefreshToken = (userId: string, tokenIdHash: string) => {
		return this.signToken(userId, ENVUtils.Vars.REFRESH_TOKEN_SECRET, tokenIdHash, ENVUtils.Vars.REFRESH_TOKEN_EXPIRES_IN)
	}


	public static signToken = (userId: string, secret: string, tokenIdHash: string, expiresIn?: string) => {
		return jwt.sign({}, secret, {
			subject: userId, jwtid: tokenIdHash, expiresIn
		})
	}
}