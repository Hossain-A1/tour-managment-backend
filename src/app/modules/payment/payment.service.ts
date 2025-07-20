/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import status from "http-status-codes";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { BookingModel } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { PaymentModel } from "./payment.model";
import { ISSLCommerz } from "../sslCommerz/sllCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";

const initPayment = async (bookingId: string) => {
  const payment = await PaymentModel.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      status.NOT_FOUND,
      "Payment not found, you have not book thi tour"
    );
  }

  const booking = await BookingModel.findById(payment.booking);

  const userName = (booking?.user as any).name;
  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhone = (booking?.user as any).phone;
  const sslPayload: ISSLCommerz = {
    name: userName,
    address: userAddress,
    email: userEmail,
    phoneNumber: userPhone,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const sucessPayment = async (query: Record<string, string>) => {
  //update Booking status to Confirm
  //update payment Status to paid
  const session = await BookingModel.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId },

      {
        status: PAYMENT_STATUS.PAID,
      },

      { new: true, runValidators: true, session }
    );

    await BookingModel.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email address phone")
      .populate("tour", "title costform")
      .populate("payment");

    await session.commitTransaction(); //transaction
    session.endSession();
    return {
      success: true,
      message: "Payment Completed Successfully!",
    };
  } catch (error: unknown) {
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};
const failPayment = async (query: Record<string, string>) => {
  const session = await BookingModel.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId },

      {
        status: PAYMENT_STATUS.FAILED,
      },

      { runValidators: true, session }
    );

    await BookingModel.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction(); //transaction
    session.endSession();
    return {
      success: false,
      message: "Payment has been Failed",
    };
  } catch (error: unknown) {
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  //update Booking status to Confirm
  //update payment Status to paid
  const session = await BookingModel.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId },

      {
        status: PAYMENT_STATUS.CANCELLED,
      },

      { runValidators: true, session }
    );

    await BookingModel.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCLE },
      { runValidators: true, session }
    );

    await session.commitTransaction(); //transaction
    session.endSession();
    return {
      success: false,
      message: "Payment has been Cancel",
    };
  } catch (error: unknown) {
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  sucessPayment,
  initPayment,
  failPayment,
  cancelPayment,
};
