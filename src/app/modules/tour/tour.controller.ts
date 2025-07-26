/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourService } from "./tour.service";
import { ITour } from "./tour.interface";
//tourType controllers are here
const handleCreateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const tourType = await TourService.createTourType(name);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Tour type has been created successfully!",
      data: tourType,
    });
  }
);

const handleUpdateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { name } = req.body;

    const tourType = await TourService.updateTourType(name, id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Tour type has been updated successfully!",
      data: tourType,
    });
  }
);

const handleDeleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    await TourService.deleteTourType(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Tour type has been deleted successfully!",
      data: null,
    });
  }
);
const handleGetAllTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_tourType = await TourService.getAllTourType();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All tour types returns successfully!",
      data: all_tourType.data,
    });
  }
);

//tour controllers are here
const handleCreateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map((file) => file.path),
    };

    const tour = await TourService.createTour(payload);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Tour has been created successfully!",
      data: tour,
    });
  }
);

const handleUpdateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map((file) => file.path),
    };

    const tour = await TourService.updateTour(payload, id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Tour has been updated successfully!",
      data: tour,
    });
  }
);
const handleDeleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    await TourService.deleteTour(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Tour has been deleted successfully!",
      data: null,
    });
  }
);

const handleGetAllTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const { meta, data } = await TourService.getAllTour(
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All tour returns successfully!",
      data,
      meta,
    });
  }
);

export const TourController = {
  handleCreateTourType,
  handleUpdateTourType,
  handleDeleteTourType,
  handleGetAllTourType,
  handleCreateTour,
  handleUpdateTour,
  handleDeleteTour,
  handleGetAllTour,
};
