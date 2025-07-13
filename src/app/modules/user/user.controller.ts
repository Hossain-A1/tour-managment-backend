/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const handleCreateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const user = await UserServices.createUser(body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created Successfully",
      data: user,
    });
  }
);

const handleUpdateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.params.id;
    const verifiedToken = req.user;
    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload) ;

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User updated Successfully",
      data: user,
    });
  }
);

const handleGetAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Returns Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserControllers = {
  handleCreateUser,
  handleGetAllUsers,
  handleUpdateUser,
};

//route matching -> controller -> services -> model ->DB
