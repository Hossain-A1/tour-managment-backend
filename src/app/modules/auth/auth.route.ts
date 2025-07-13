import { Router } from "express";
import { AuthControler } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkIsAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", AuthControler.handleCredentialsLogin);
//refresh token
router.post("/refresh-token", AuthControler.handleGetNewAccessToken);
//logout
router.post("/logout", AuthControler.handleLogout);
//reset password
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControler.handleResetPasswprd
);
//google login route
router.get("/google", AuthControler.handleGoogleLogin);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControler.handleGoogleCallback
);

export const AuthRoutes = router;
