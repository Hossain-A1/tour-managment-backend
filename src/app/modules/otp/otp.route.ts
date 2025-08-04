import { Router } from "express";
import { OTPController } from "./otp.controller";


const router =Router()


router.post('/send',OTPController.hnadleSendOTP)
router.post('/verify',OTPController.handleVerifyOTP)

export const OtpRoutes = router