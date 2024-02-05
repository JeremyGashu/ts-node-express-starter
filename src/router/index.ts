import { Application } from "express";
import userRoute from "./user.route";

export const initAllAppRoutes = (app: Application) => {
    app.use("/api/users", userRoute);
};