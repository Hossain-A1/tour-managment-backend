/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleDuplicateError } from "../errorHelpers/handleDuplicateError";
import { handleCastError } from "../errorHelpers/handleCastError";
import { handleZodError } from "../errorHelpers/handleZodError";
import { handleValidationError } from "../errorHelpers/handleValidationError";
import { TErorSources } from "../interfaces/error.types";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );
    await Promise.all(imageUrls.map((url) => deleteImageFromCloudinary(url)));
  }

  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: any = [];

  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }

  //duplicatet error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    //objectId error /cast error
  } else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    //zod error
  } else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  //Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
