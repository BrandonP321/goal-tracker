import express from "express";
import { Routes } from "@goal-tracker/shared/src/api/routes";
import { GetFullUserController } from "~Controllers/user.controllers";
import { AuthJwt } from "~Middleware/AuthJWT";

const router = express.Router();

router.get(Routes.User.GetFullUser({}), AuthJwt, GetFullUserController);

export default router;