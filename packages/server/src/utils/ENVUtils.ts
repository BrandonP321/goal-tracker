export class ENVUtils {
	
	public static Vars = {
		SECRET: process.env.SECRET ?? "",
		ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? "",
		REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? "",
		ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "",
		REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "",
		ENV: process.env.ENV ?? ""
	}

	public static isLiveEnv = this.Vars.ENV === "live";

	/** Ensures all env vars exist, throwing an error if one does not */
	public static verifyEnvVarsExist = () => {
		let envVar: keyof typeof this.Vars;
		for (envVar in this.Vars) {
			if (!this.Vars[envVar]) {
				console.error("Missing env var: " + envVar);
				process.exit(2)
			}
		}
	}
}