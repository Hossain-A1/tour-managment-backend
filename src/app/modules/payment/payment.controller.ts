import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";

const handleInitPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;

  const resutlt = await PaymentService.initPayment(bookingId);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Payment done Successfully",
    data: resutlt,
  });
});
const handleSucessPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const resutlt = await PaymentService.sucessPayment(
    query as Record<string, string>
  );
  if (resutlt.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${resutlt.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const handleFailPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const resutlt = await PaymentService.failPayment(
    query as Record<string, string>
  );
  if (!resutlt.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${resutlt.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const handleCancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const resutlt = await PaymentService.cancelPayment(
    query as Record<string, string>
  );
  if (!resutlt.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${resutlt.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

export const PaymentController = {
  handleInitPayment,
  handleSucessPayment,
  handleFailPayment,
  handleCancelPayment,
};
