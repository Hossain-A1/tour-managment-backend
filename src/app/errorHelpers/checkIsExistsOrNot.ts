/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "mongoose";
import { StatusCodes as status } from "http-status-codes";
import AppError from "./AppError";

export const checkIsExists = async <T>(
  model: Model<T>,
  field: Partial<Record<keyof T, any>>
) => {
  const exists = await model.exists(field);
  if (exists) {
    const fieldName = Object.keys(field).join(", ");
    throw new AppError(
      status.BAD_REQUEST,
      `${fieldName} already exists in DB. Please use a different ${fieldName}.`
    );
  }
};

export const checkNotExists = async <T>(
  model: Model<T>,
  field: Partial<Record<keyof T, any>>
) =>{
  const exists = await model.exists(field);
  if (!exists) {
    const fieldName = Object.keys(field).join(", ");
    throw new AppError(
      status.BAD_REQUEST,
      `${fieldName} not exists in DB. Please use a different ${fieldName}.`
    );
  }
};
