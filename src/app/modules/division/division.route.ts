import { Router } from "express";
import { validateRequest } from "../../middlewares/validadeRequest";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";
import { checkAuth } from "../../middlewares/checkIsAuth";
import { Role } from "../user/user.interface";
import { DivisionController } from "./division.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();
//gets divisions
router.get("/", DivisionController.handleGetDivision);
//get a single division
router.get("/:slug", DivisionController.handleGetSingleDivision);

//create division route
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionZodSchema),
  DivisionController.handleCreateDivision
);
//update division route
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single('file'),
  validateRequest(updateDivisionZodSchema),
  DivisionController.handleUpdateDivision
);
//delete division route
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.handleDeleteDivision
);

export const DivisionRoutes = router;
