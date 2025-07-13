/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import status from "http-status-codes";
import bcryptjs from "bcryptjs";
import { IUser } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await UserModel.findOne({ email });

  if (!isUserExist) {
    throw new AppError(status.BAD_REQUEST, "Email does not exist.");
  }

  const isPasswordMatche = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatche) {
    throw new AppError(status.BAD_REQUEST, "Incorrect Password");
  }

  const { accessToken, refreshToken } = createUserToken(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};

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
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
