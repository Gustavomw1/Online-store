import { Router } from "express";
import userRouter from "../controllers/UserController.ts";

const routers = Router();

routers.get("/profile", userRouter);
routers.post("/register", userRouter);
routers.post("/login", userRouter);
routers.delete("/profile/:id", userRouter);

export default routers;
