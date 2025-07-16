/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleCastError = (err: any): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid mongoDb objectId",
  };
};