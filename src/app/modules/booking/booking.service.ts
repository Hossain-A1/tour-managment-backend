/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { UserModel } from "../user/user.model";
import stattus from "http-status-codes";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { BookingModel } from "./booking.model";
import { PaymentModel } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { TourModel } from "../tour/tour.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sllCommerz.interface";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { getTransactionId } from "../../utils/getTransactionId";



const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();
  const session = await BookingModel.startSession();
  session.startTransaction();
  try {
    const user = await UserModel.findById(userId);

    if (!user?.phone || !user.address) {
      throw new AppError(
        stattus.BAD_REQUEST,
        "Please update your profile to Book a Tour! update fields like phone ,address etc "
      );
    }

    const tour = await TourModel.findById(payload.tour).select("costForm");

    if (!tour?.costForm) {
      throw new AppError(stattus.BAD_REQUEST, "No tour cost found");
    }

    const amount = Number(tour.costForm) * Number(payload.guestCount);
    //crate booking
    const booking = await BookingModel.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );
    //create payment
    const payment = await PaymentModel.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session }
    );

    const updatedBooking = await BookingModel.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email address phone")
      .populate("tour", "title costform")
      .populate("payment");

    const userName = (updatedBooking?.user as any).name;
    const userAddress = (updatedBooking?.user as any).address;
    const userEmail = (updatedBooking?.user as any).email;
    const userPhone = (updatedBooking?.user as any).phone;
    const sslPayload: ISSLCommerz = {
      name: userName,
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhone,
      amount: amount,
      transactionId: transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    await session.commitTransaction(); //transaction
    session.endSession();
    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error: unknown) {
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};

const getUserBooking = async (decodedUser: JwtPayload) => {
  const bookings = await BookingModel.find({ user: decodedUser.userId })
    .populate("user", "name email")
    .populate("tour", "title")
    .populate("payment");

  return {
    data: bookings,
    meta: null,
  };
};
const getSingleBooking = async (bookingId: string) => {
  const booking = await BookingModel.findById(bookingId);

  if (!booking) {
    throw new AppError(
      stattus.NOT_FOUND,
      "Booking not found with this bookingId"
    );
  }

  return booking;
};

const getAllBookings = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(BookingModel.find(), query);

  const bookings = await queryBuilder
    .filter()
    .search(["status"])
    .fields()
    .pagenate();

  const [data, meta] = await Promise.all([
    bookings.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const updateBookingStatus = async (bookingId: string, urlStatus: string) => {
  const isExist = await BookingModel.findById(bookingId);

  if (!isExist) {
    throw new AppError(
      stattus.NOT_FOUND,
      "Booking not found with this bookingId"
    );
  }

  const updatedBooking = await BookingModel.findByIdAndUpdate(
    bookingId,
    {
      status: urlStatus,
    },
    { new: true, runValidators: true }
  );

  return updatedBooking;
};

export const BookingService = {
  createBooking,
  getUserBooking,
  getSingleBooking,
  getAllBookings,
  updateBookingStatus,
};
