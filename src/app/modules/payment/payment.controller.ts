/* eslint-disable no-console */
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { SSLService } from "../sslCommerz/sslCommerz.service";

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

const handleGetInvoiceDownloadUrl = catchAsync(
  async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;
    const decodedUser = req.user as JwtPayload;

    const result = await PaymentService.getInvoiceDownloadUrl(
      paymentId,
      decodedUser.userId
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment url download Successfully",
      data: result,
    });
  }
);

const handleSSLValidatePayment = catchAsync(
  async (req: Request, res: Response) => {
    console.log('validate payment body',req.body);
    await SSLService.validatePayment(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment validate Successfully",
      data: null,
    });
  }
);

export const PaymentController = {
  handleInitPayment,
  handleSucessPayment,
  handleFailPayment,
  handleCancelPayment,
  handleGetInvoiceDownloadUrl,
  handleSSLValidatePayment,
};
