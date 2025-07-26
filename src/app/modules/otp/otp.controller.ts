import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OTPService, sendOTP } from "./otp.service";

const hnadleSendOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, name } = req.body;

  await sendOTP(email, name);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent successfully",
    data: null,
  });
});

const handleVerifyOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await OTPService.verifyOTP(email, otp);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verivied successfully",
    data: null,
  });
});

export const OTPController = {
  hnadleSendOTP,
  handleVerifyOTP,
};
