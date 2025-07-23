import AppError from "../../errorHelpers/AppError";
import status from "http-status-codes";
import { TourModel, TourTypeModel } from "./tour.model";
import { ITour, ITourType } from "./tour.interface";
import { BookingModel } from "../booking/booking.model";
import {
  checkIsExists,
  checkNotExists,
} from "../../errorHelpers/checkIsExistsOrNot";
import { tourSearchAbleField } from "./tour.constaint";
import { QueryBuilder } from "../../utils/QueryBuilder";
//create tourType service
const createTourType = async (name: string) => {
  await checkIsExists<ITourType>(TourTypeModel, { name });
  const tourType = await TourTypeModel.create({ name });
  return tourType;
};
//update tourType service
const updateTourType = async (name: string, id: string) => {
  await checkNotExists<ITourType>(TourTypeModel, { _id: id });

  const tourType = await TourTypeModel.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  return tourType;
};
//update tourType service
const deleteTourType = async (id: string) => {
  await checkNotExists<ITourType>(TourTypeModel, { _id: id });

  const isAssociated = await TourModel.exists({ tourType: id });

  if (isAssociated) {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot delete this tour type because it is associated with existing tours."
    );
  }

  await TourTypeModel.findByIdAndDelete(id);
};
//gets all tourType service
const getAllTourType = async () => {
  const all_tourType = await TourTypeModel.find({});
  const all_tourType_count = await TourTypeModel.countDocuments();
  return {
    data: all_tourType,
    meta: {
      total: all_tourType_count,
    },
  };
};
//create tour service
const createTour = async (payload: ITour) => {
  await checkIsExists<ITour>(TourModel, { title: payload.title });

  const tour = await TourModel.create(payload);

  return tour;
};
//update tour service
const updateTour = async (payload: Partial<ITour>, id: string) => {
  await checkNotExists<ITour>(TourModel, { _id: id });

  const tour = await TourModel.findByIdAndUpdate(id, payload, { new: true });

  return tour;
};
//delete tour service
const deleteTour = async (id: string) => {
  await checkNotExists<ITour>(TourModel, { _id: id });

  const isAssociated = await BookingModel.findOne({ tourId: id });

  if (isAssociated) {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot delete this tour because it has one or more associated bookings. Please update or delete the related bookings first."
    );
  }

  await TourModel.findByIdAndDelete(id);
};
//get tour service
const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(TourModel.find(), query);

  const tours = await queryBuilder
    .search(tourSearchAbleField)
    .filter()
    .sort()
    .fields()
    .pagenate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    meta,
    data,
  };
};

export const TourService = {
  createTourType,
  updateTourType,
  deleteTourType,
  getAllTourType,
  createTour,
  updateTour,
  deleteTour,
  getAllTour,
};
