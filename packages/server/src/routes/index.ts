import { Express } from "express";
import authRoutes from "./auth.routes";

export const configureRoutes = (app: Express) => {
    app.use(authRoutes);
}