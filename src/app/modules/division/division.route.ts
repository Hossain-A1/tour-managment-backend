import { Router } from "express";
import { validateRequest } from "../../middlewares/validadeRequest";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";
import { checkAuth } from "../../middlewares/checkIsAuth";
import { Role } from "../user/user.interface";
import { DivisionController } from "./division.controller";

const router = Router();
//create division route
router.post(
  "/create",
  validateRequest(createDivisionZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.handleCreateDivision
);
//update division route
router.patch(
  "/:id",
  validateRequest(updateDivisionZodSchema),
  checkAuth(...Object.values(Role)),
  DivisionController.handleUpdateDivision
);
//delete division route
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.handleDeleteDivision
);
//gets divisions
router.get("/", DivisionController.handleGetDivision);

export const DivisionRoutes = router;
