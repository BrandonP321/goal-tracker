import express from "express";
import { Routes } from "@goal-tracker/shared/src/api/routes";
import { GetFullUserController, GetUserGoalsController } from "~Controllers/user.controllers";
import { AuthJwt } from "~Middleware/AuthJWT";

const router = express.Router();

router.get(Routes.User.GetFullUser({}), AuthJwt, GetFullUserController);
router.get(Routes.User.GetUserGoals({}), AuthJwt, GetUserGoalsController);

export default router;