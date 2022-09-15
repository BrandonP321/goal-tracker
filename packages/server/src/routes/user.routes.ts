import express from "express";
import { Routes } from "@goal-tracker/shared/src/api/routes";
import { GetFullUserController, GetUserGoalsController } from "~Controllers/user.controllers";
import { AuthJwt } from "~Middleware/AuthJWT";
import { GetUserMiddleware } from "~Middleware/GetUser.middleware";

const router = express.Router();

router.get(Routes.User.GetFullUser({}), AuthJwt, GetUserMiddleware, GetFullUserController);
router.get(Routes.User.GetUserGoals({}), AuthJwt, GetUserMiddleware, GetUserGoalsController);

export default router;