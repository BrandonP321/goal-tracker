import express from "express";
import { Routes } from "@goal-tracker/shared/src/api/routes";
import { LoginUserController, RegisterUserController } from "~Controllers/auth.controllers";

const router = express.Router();

router.post(Routes.Auth.Register({}), RegisterUserController);
router.post(Routes.Auth.Login({}), LoginUserController);

export default router;