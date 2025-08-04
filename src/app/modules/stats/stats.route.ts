import { Router } from "express";
import { checkAuth } from "../../middlewares/checkIsAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = Router();
router.get(
  "/user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.handleGetUserStats
);
router.get(
  "/booking",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.handleGetBookingStats
);
router.get(
  "/payment",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.handleGetPaymentStats
);

router.get(
  "/tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.handleGetTourStats
);

export const StatsRoutes = router;
