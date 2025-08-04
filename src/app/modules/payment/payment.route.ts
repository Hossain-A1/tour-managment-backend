import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkIsAuth";
import { Role } from "../user/user.interface";

const router = Router();

//api/v1/booking

router.post("/init-payment/:bookingId",PaymentController.handleInitPayment);
router.post("/success",PaymentController.handleSucessPayment);
router.post("/fail",PaymentController.handleFailPayment);
router.post("/cancel",PaymentController.handleCancelPayment);
router.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), PaymentController.handleGetInvoiceDownloadUrl);

router.post('/validate-payment',PaymentController.handleSSLValidatePayment)

export const PaymentRoutes = router;
