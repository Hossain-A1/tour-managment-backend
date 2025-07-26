import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const handleGetUserStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsService.getUserStats();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "all user property returns",
    data: result,
  });
});

const handleGetTourStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsService.getTourStats();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "all tour property returns",
    data: result,
  });
});

const handleGetBookingStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsService.getBookingStats();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "all booking returns",
    data: result,
  });
});

const handleGetPaymentStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsService.getPaymentStats();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "all payment returns",
    data: result,
  });
});

export const StatsController = {
  handleGetUserStats,
  handleGetTourStats,
  handleGetPaymentStats,
  handleGetBookingStats
};
