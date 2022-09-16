import { Express } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import goalRoutes from "./goal.routes";

export const configureRoutes = (app: Express) => {
    app.use(authRoutes);
    app.use(userRoutes);
    app.use(goalRoutes);
}