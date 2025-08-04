import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import status from "http-status-codes";
import { verifiToken } from "../utils/jwt";
import { UserModel } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";
//HOF for checking authorizetion
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No token recived");
      }
      const verifiedToken = verifiToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await UserModel.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExist) {
        throw new AppError(status.BAD_REQUEST, "User does not exist");
      }

       if (!isUserExist.isVerified) {
        throw new AppError(status.BAD_REQUEST, "User is not verified");
      }
      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          status.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }

      if (isUserExist.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "User is deleted");
      }

     

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not authorized for this action");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
