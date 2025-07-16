import slugfy from "slugify";
import status from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { DivisionModel } from "./division.model";
import { TourModel } from "../tour/tour.model";
import {
  checkIsExists,
  checkNotExists,
} from "../../errorHelpers/checkIsExistsOrNot";

//create division service
const createDivision = async (payload: Partial<IDivision>) => {
  await checkIsExists<IDivision>(DivisionModel, { name: payload });
  const division = await DivisionModel.create({
    name: payload,
    slug: slugfy(payload as string),
  });

  return division;
};
//update division service
const updateDivision = async (payload: Partial<IDivision>, id: string) => {
  await checkNotExists<IDivision>(DivisionModel, { _id: id });
  const { name, ...rest } = payload;

  const division = await DivisionModel.findByIdAndUpdate(
    id,
    {
      name: name,
      slug: slugfy(name as string),
      ...rest,
    },
    { new: true }
  );

  return division;
};
//delete division service
const deleteDivision = async (id: string) => {
  const isExistsDivision = await TourModel.exists({ division: id });

  if (isExistsDivision) {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot delete this division because it is associated with one or more tours. Please remove or update those tours first."
    );
  }

  await DivisionModel.findByIdAndDelete(id);
};
//get division service
const getDivision = async () => {
  const divisions = await DivisionModel.find({});
  const totalNumOfDivision = await DivisionModel.countDocuments();

  return {
    data: divisions,
    meta: {
      total: totalNumOfDivision,
    },
  };
};

export const DivisionService = {
  createDivision,
  updateDivision,
  deleteDivision,
  getDivision,
};
