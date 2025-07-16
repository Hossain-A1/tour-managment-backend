/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import status from "http-status-codes";
import bcryptjs from "bcryptjs";
import { UserModel } from "../user/user.model";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return { accessToken: newAccessToken };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await UserModel.findById(decodedToken.userId);

  const oldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );

  if (!oldPasswordMatch) {
    throw new AppError(status.BAD_REQUEST, "Old Password not match");
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user!.save();
};

export const AuthService = {
  getNewAccessToken,
  resetPassword,
};
