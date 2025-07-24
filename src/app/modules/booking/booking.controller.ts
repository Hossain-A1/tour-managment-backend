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
    const query = req.query;
    const booking = await BookingService.getAllBookings(
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Booking returns successfully!!",
      data: booking.data,
      meta: booking.meta,
    });
  }
);
const handleGetUserBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const bookings = await BookingService.getUserBooking(user as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Booking return successfully!!",
      data: bookings.data,
    });
  }
);

const handleGetSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const boookingId = req.params.bookingId;
    const booking = await BookingService.getSingleBooking(boookingId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Booking return successfully!!",
      data: booking,
    });
  }
);
const handleUpdateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const boookingId = req.params.bookingId;
    const status = req.query.status as string;

    const booking = await BookingService.updateBookingStatus(
      boookingId,
      status
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
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
