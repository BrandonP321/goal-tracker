import { UserModel } from "@goal-tracker/shared/src/api/models/User.model";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENVUtils } from "./ENVUtils";

export type JWTResLocals = {
	userId: string;
}

type TAuthTokens = {
	aToken: string;
	rToken: string;
}

const authTokenCookieName = "authTokens";

export class JWTUtils {
	/** Returns random hash */
	public static generateHash = async () => {
		// generate hash without any periods to avoid problems accessing objects with hash as they key
		return ((await bcrypt.hash(ENVUtils.Vars.SECRET, 10)).replace(/\./g, ""))
	}

	/** Stores access & refresh tokens in http secured cookies */
	public static generateTokenCookies = (tokens: TAuthTokens, res: Response) => {
		const maxAgeSeconds = parseInt(ENVUtils.Vars.REFRESH_TOKEN_EXPIRES_IN.split("s")[0]);
		const maxAgeMs = maxAgeSeconds && (maxAgeSeconds * 1000);

		res.cookie(authTokenCookieName, JSON.stringify(tokens), {
			secure: ENVUtils.isLiveEnv,
			httpOnly: true,
			sameSite: ENVUtils.isLiveEnv ? "none" : "lax",
			// max age should be equivalent to the life span of a refresh token
			maxAge: maxAgeMs
		})
	}

	/** Gets JWT auth cookie, returning undefined if no cookie exists */
	public static getTokensFromCookie = (req: Request) => {
		const cookie: undefined | string = req.cookies?.[authTokenCookieName];
		const parsedCookie: undefined | TAuthTokens = cookie && JSON.parse(cookie);

		return parsedCookie;
	}

	public static destroyTokenCookie = (res: Response) => {
		res.clearCookie(authTokenCookieName, {	
			secure: ENVUtils.isLiveEnv,
			httpOnly: true,
			sameSite: ENVUtils.isLiveEnv ? "none" : "lax",
		});
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

	/** Generates auth tokens and stores them in secured http cookies */
	public static generateAndStoreTokens = async (userId: string, res: Response, tokenHash?: string) => {
		const newTokenHash = tokenHash ?? await this.generateHash();
		const authTokens = this.generateTokens(userId, newTokenHash);

		if (authTokens) {
			this.generateTokenCookies(authTokens, res);
		}

		return { tokens: authTokens, tokenHashId: newTokenHash };
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

	public static verifyAccessToken = (token: string) => {
		return this.verifyToken(token, ENVUtils.Vars.ACCESS_TOKEN_SECRET);
	}

	public static verifyRefreshToken = (token: string) => {
		return this.verifyToken(token, ENVUtils.Vars.REFRESH_TOKEN_SECRET);
	}

	public static verifyToken = (token: string, secret: string) => {
		const decodedToken = jwt.decode(token);

		let isExpired = false;

		try {
			// verify that token is still valid & not expired
			jwt.verify(token, secret);
		} catch (err) {
			// if error is thrown while verifying jwt, token is expired
			isExpired = true;
		}

		// if either the token couldn't be verified or sub/jti payload properties are undefined, return undefined
		if (typeof decodedToken === "string" || !decodedToken || !decodedToken.sub || !decodedToken.jti) {
			return undefined;
		}

		return {
			token: decodedToken,
			isExpired,
			userId: decodedToken.sub,
			jwtHash: decodedToken.jti
		}
	}
}