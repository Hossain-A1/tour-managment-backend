/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

//create a booking
const handleCreateBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const body = req.body;
    const booking = await BookingService.createBooking(
      body,
      decodedToken.userId
    );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Booking created successfully!!",
      data: booking,
    });
  }
);

const handleGetAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingService.getAllBookings();

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Booking returns successfully!!",
      data: booking,
    });
  }
);
const handleGetUserBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingService.getUserBooking();

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Booking return successfully!!",
      data: booking,
    });
  }
);

const handleGetSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingService.getSingleBooking();

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Booking return successfully!!",
      data: booking,
    });
  }
);
const handleUpdateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingService.updateBookingStatus();

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Booking status update successfully!!",
      data: booking,
    });
  }
);

export const BookingController = {
  handleCreateBooking,
  handleGetAllBookings,
  handleGetUserBooking,
  handleGetSingleBooking,
  handleUpdateBookingStatus,
};
