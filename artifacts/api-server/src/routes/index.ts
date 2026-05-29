import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import localAuthRouter from "./local-auth";
import contactRouter from "./contact";
import publicRouter from "./public";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(localAuthRouter);
router.use(contactRouter);
router.use(publicRouter);
router.use(dashboardRouter);

export default router;
