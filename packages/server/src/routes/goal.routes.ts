import express from "express";
import { Routes } from "@goal-tracker/shared/src/api/routes";
import { CreateGoalController, GetUserGoalsController, UpdateGoalController } from "~Controllers/goal.controllers";
import { AuthJwt } from "~Middleware/AuthJWT";
import { GetUserMiddleware } from "~Middleware/GetUser.middleware";

const router = express.Router();

router.post(Routes.Goal.CreateGoal({}), AuthJwt, GetUserMiddleware, CreateGoalController);
router.get(Routes.Goal.GetUserGoals({}), AuthJwt, GetUserMiddleware, GetUserGoalsController);
router.put(Routes.Goal.UpdateGoal({}), AuthJwt, GetUserMiddleware, UpdateGoalController);

export default router;