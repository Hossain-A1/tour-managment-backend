import { Router } from "express";
import { validateRequest } from "../../middlewares/validadeRequest";

import { checkAuth } from "../../middlewares/checkIsAuth";
import { Role } from "../user/user.interface";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourZodSchema,
} from "./tour.validation";
import { TourController } from "./tour.controller";

const router = Router();
//create tourType route
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourController.handleCreateTourType
);
//update tourType route
router.patch(
  "/tour-types/:id",
  validateRequest(createTourTypeZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.handleUpdateTourType
);
//update tourType route
router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.handleDeleteTourType
);
//gets all tourType route
router.get("/tour-types", TourController.handleGetAllTourType);
//create tour route
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  TourController.handleCreateTour
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourZodSchema),
  TourController.handleUpdateTour
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.handleDeleteTour
);

router.get("/", TourController.handleGetAllTour);

export const TourRoutes = router;
