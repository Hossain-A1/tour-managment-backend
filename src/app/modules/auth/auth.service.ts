/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import status from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IAuthProvider, IsActive } from "../user/user.interface";
import { sendEmail } from "../../utils/emailSender";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return { accessToken: newAccessToken };
};

const setPassword = async (userId: string, password: string) => {
  if (!password) {
    throw new AppError(status.BAD_REQUEST, "Please provide password");
  }
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(status.NOT_FOUND, "user not foun");
  }

  if (user?.password && user?.auths.some((obj) => obj.provider === "google")) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already set your password. Now you can change the password from your profile."
    );
  }

  const hashPassword = await bcryptjs.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user?.email,
  };
  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashPassword;
  user.auths = auths;
  user!.save();
};

const forgetPassword = async (email: string) => {
  const isUserExist = await UserModel.findOne({ email });

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "user not found with the email");
  }

  if (!isUserExist.isVerified) {
    throw new AppError(status.BAD_REQUEST, "User is not verified");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(status.BAD_REQUEST, `User is ${isUserExist.isActive}`);
  }

  if (isUserExist.isDeleted) {
    throw new AppError(status.BAD_REQUEST, "User is deleted");
  }

  const JwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(JwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password reset",
    templateName: "forgetpassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};

const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id != decodedToken.userId) {
    throw new AppError(status.BAD_REQUEST, "You can not change the password");
  }

  const user = await UserModel.findById(decodedToken.userId);

  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "User not found");
  }

  const hashPass = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user.password = hashPass;
  await user.save();
};

const changePassword = async (
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
  changePassword,
  setPassword,
  forgetPassword,
};
