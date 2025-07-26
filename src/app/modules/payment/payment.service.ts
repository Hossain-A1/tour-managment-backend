/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import status from "http-status-codes";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { BookingModel } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { PaymentModel } from "./payment.model";
import { ISSLCommerz } from "../sslCommerz/sllCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { generatePDF, IInvoiceData } from "../../utils/invoice";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { sendEmail } from "../../utils/emailSender";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import { Types } from "mongoose";

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
    if (!updatedPayment) {
      throw new AppError(404, "Payment not found");
    }
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email address phone")
      .populate("tour", "title costform")
      .populate("payment");

    if (!updatedBooking) {
      throw new AppError(404, "booking not found");
    }

    const invoiceData: IInvoiceData = {
      bookingDate: updatedBooking.createdAt as Date,
      guestCount: updatedBooking?.guestCount,
      totalAmount: updatedPayment?.amount,
      tourTitle: (updatedBooking?.tour as unknown as ITour).title,
      transactionId: updatedPayment?.transactionId,
      userName: (updatedBooking?.user as unknown as IUser).name,
    };

    const pdfBuffer = await generatePDF(invoiceData);

    const cloudinaryResult = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice"
    );

    if (!cloudinaryResult) {
      throw new AppError(400, "pdf uploading error");
    }

    await PaymentModel.findByIdAndUpdate(
      updatedPayment._id,
      { invoiceUrl: cloudinaryResult?.secure_url },
      { runValidators: true, session }
    );

    await sendEmail({
      to: (updatedBooking?.user as unknown as IUser).name,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

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
const getInvoiceDownloadUrl = async (
  paymentId: string,
  userId: Types.ObjectId
) => {
  const booking = await BookingModel.findById(userId)

  if (!booking) {
    return;
  }

  const user = booking.user;
  if (user !== userId) {
    throw new AppError(401, "Not Allowed");
  }
  const payment = await PaymentModel.findById(paymentId).select("invoiceUrl");

  if (!payment) {
    throw new AppError(404, "Payment not found with the paymentId");
  }

  if (!payment.invoiceUrl) {
    throw new AppError(404, "Invoice url not found");
  }

  return payment.invoiceUrl;
};

export const PaymentService = {
  sucessPayment,
  initPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl,
};
