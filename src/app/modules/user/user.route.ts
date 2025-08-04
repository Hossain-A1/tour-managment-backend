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

router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.handleUpdateUser
);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.handleGetAllUsers
);
router.get(
  "/me",
  checkAuth(...Object.values(Role)),
  UserControllers.handleMyProfile
);



export const UserRoutes = router;
