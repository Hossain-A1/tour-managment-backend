import { IDivision } from "./division.interface";
import { DivisionModel } from "./division.model";
import {
  checkIsExists,
  checkNotExists,
} from "../../errorHelpers/checkIsExistsOrNot";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { divisionSearchAbleField } from "./division.constants";

//create division service
const createDivision = async (payload: Partial<IDivision>) => {
  await checkIsExists<IDivision>(DivisionModel, { name: payload.name });

  const division = await DivisionModel.create(payload);

  return division;
};
//update division service
const updateDivision = async (payload: Partial<IDivision>, id: string) => {
  await checkNotExists<IDivision>(DivisionModel, { _id: id });
  const duplicatedDivision = await DivisionModel.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicatedDivision) {
    throw new Error("A division with this name already exists");
  }

  const division = await DivisionModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return division;
};
//delete division service
const deleteDivision = async (id: string) => {
  await DivisionModel.findByIdAndDelete(id);
  return null;
};

//get single division service
const getSingleDivision = async (slug: string) => {
  const division = await DivisionModel.findOne({ slug });
  return {
    data: division,
  };
};
//get division service
const getDivision = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(DivisionModel.find(), query);

  const divisions = await queryBuilder
    .search(divisionSearchAbleField)
    .filter()
    .sort()
    .pagenate()
    .build();

  const { total, totalPage, page, limit } = await queryBuilder.getMeta();

  return {
    data: divisions,
    meta: {
      total,
      totalPage,
      page,
      limit,
    },
  };
};

export const DivisionService = {
  createDivision,
  updateDivision,
  deleteDivision,
  getDivision,
  getSingleDivision,
};
