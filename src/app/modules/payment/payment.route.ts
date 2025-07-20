import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

//api/v1/booking

router.post("/init-payment/:bookingId",PaymentController.handleInitPayment);
router.post("/success",PaymentController.handleSucessPayment);
router.post("/fail",PaymentController.handleFailPayment);
router.post("/cancel",PaymentController.handleCancelPayment);

export const PaymentRoutes = router;
