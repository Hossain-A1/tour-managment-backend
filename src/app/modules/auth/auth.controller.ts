/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import status from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookis";
import passport from "passport";
import { createUserToken } from "../../utils/userTokens";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
//google login
const handleGoogleLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";

    passport.authenticate("google", { scope: ["profile", "email"],state:redirect as string})(
      req,
      res,
      next
    );
  }
);

//google login callback handler
const handleGoogleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state?req.query.state as string:""
    if(redirectTo.startsWith('/')){
      redirectTo= redirectTo.slice(1)
    }
    const user = req.user;

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserToken(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

//login handler
const handleCredentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Login Successfully",
      data: loginInfo,
    });
  }
);

//logout handler
const handleLogout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Logout Successfully",
      data: null,
    });
  }
);
//refresh token handler
const handleGetNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const newAccessToken = await AuthService.getNewAccessToken(refreshToken);

    setAuthCookie(res, newAccessToken);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "New access token created Successfully",
      data: newAccessToken,
    });
  }
);
//reset password
const handleResetPasswprd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    await AuthService.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Password changed Successfully",
      data: null,
    });
  }
);

export const AuthControler = {
  handleGoogleLogin,
  handleCredentialsLogin,
  handleGoogleCallback,
  handleLogout,
  handleGetNewAccessToken,
  handleResetPasswprd,
};
