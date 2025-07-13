import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validadeRequest";
import { Router } from "express";
import { checkAuth} from "../../middlewares/checkIsAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.handleCreateUser
);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.handleGetAllUsers
);

router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.handleUpdateUser
);

export const UserRoutes = router;
