import { Router, NextFunction, Request, Response } from "express";
import { AuthControler } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkIsAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";
import {
  forgetPasswordZodSchema,
  resetPasswordZodSchema,
} from "./auth.validation";
import { validateRequest } from "../../middlewares/validadeRequest";

const router = Router();
//google login route
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res, next);
}); 
// api/v1/auth/google/callback?state=/booking
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=there is some issues with your account. Please contact with out support team.`,
  }),
  AuthControler.handleGoogleCallback
);

router.post("/login", AuthControler.handleCredentialsLogin);
//refresh token
router.post("/refresh-token", AuthControler.handleGetNewAccessToken);
//logout
router.post("/logout", AuthControler.handleLogout);

//change password
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthControler.handleChangePassword
);
//set password
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthControler.handleSetPassword
);

//forget password
router.post(
  "/forget-password",
  validateRequest(forgetPasswordZodSchema),
  AuthControler.handleForgetPassword
);

//reset password
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  validateRequest(resetPasswordZodSchema),
  AuthControler.handleResetPassword
);

export const AuthRoutes = router;
