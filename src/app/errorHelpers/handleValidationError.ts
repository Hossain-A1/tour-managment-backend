/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { TErorSources, TGenericErrorResponse } from "../interfaces/error.types";

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TErorSources[] = [];

  const errors = Object.values(err.errors);

  errors.forEach((errorObj: any) =>
    errorSources.push({
      path: errorObj.path,
      message: errorObj.message,
    })
  );

  return {
    statusCode: 400,
    message: err.message,
    errorSources,
  };
};