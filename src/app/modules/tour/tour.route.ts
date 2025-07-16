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
  validateRequest(createTourTypeZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.handleCreateTourType
);
//update tourType route
router.patch(
  "/tour-types/:id",
  validateRequest(createTourTypeZodSchema),
  checkAuth(...Object.values(Role)),
  TourController.handleUpdateTourType
);
//update tourType route
router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  TourController.handleDeleteTourType
);
//gets all tourType route
router.get("/tour-types", TourController.handleGetAllTourType);
//create tour route
router.post(
  "/create",
  validateRequest(createTourZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.handleCreateTour
);

router.patch(
  "/:id",
  validateRequest(updateTourZodSchema),
  checkAuth(...Object.values(Role)),
  TourController.handleUpdateTour
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.handleDeleteTour
);

router.get("/", TourController.handleGetAllTour);

export const TourRoutes = router;
