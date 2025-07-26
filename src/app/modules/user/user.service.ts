import AppError from "../../errorHelpers/AppError";
import bcryptjs from "bcryptjs";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { UserModel } from "./user.model";
import status from "http-status-codes";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchAbleField } from "./user.constants";
//create user service
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const hashPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authsProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await UserModel.create({
    email,
    password: hashPassword,
    auths: [authsProvider],
    ...rest,
  });

  return user;
};

//get all users service
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(UserModel.find(), query);

  const users = await queryBuilder
    .search(userSearchAbleField)
    .filter()
    .sort()
    .fields()
    .pagenate()
    .build();

  const { total, totalPage, page, limit } = await queryBuilder.getMeta();
  return {
    data: users,
    meta: {
      total,
      totalPage,
      page,
      limit,
    },
  };
};

//get my profile service
const getMyProfile = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found with the id");
  }

  return {
    data: user,
  };
};

//update  user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await UserModel.findById(userId);

  if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    if (userId !== decodedToken.userId) {
      throw new AppError(status.FORBIDDEN, "You are not authorized");
    }
  }

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User Not Found");
  }

  if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    throw new AppError(status.FORBIDDEN, "You are not authorized");
  }

  if (payload.role) {
    if (decodedToken.role === Role.ADMIN && isUserExist.role === Role.ADMIN) {
      throw new AppError(status.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(status.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdatedUser = await UserModel.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  getMyProfile,
};
