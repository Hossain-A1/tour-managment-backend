/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookingModel } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { PaymentModel } from "../payment/payment.model";
import { TourModel } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { UserModel } from "../user/user.model";

const now = new Date();

const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);

const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUserPromise = UserModel.countDocuments();
  const totalActiveUserPromise = UserModel.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInactiveUserPromise = UserModel.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockUserPromise = UserModel.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUserInLast7DaysPromise = UserModel.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUserInLast30DaysPromise = UserModel.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromise = UserModel.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUser,
    totalActiveUser,
    totalInactiveUser,
    totalBlockUser,
    newUserInLast7Days,
    newUserInLast30Days,
    usersByRole,
  ] = await Promise.all([
    totalUserPromise,
    totalActiveUserPromise,
    totalInactiveUserPromise,
    totalBlockUserPromise,
    newUserInLast7DaysPromise,
    newUserInLast30DaysPromise,
    usersByRolePromise,
  ]);

  return {
    totalUser,
    totalActiveUser,
    totalInactiveUser,
    totalBlockUser,
    newUserInLast7Days,
    newUserInLast30Days,
    usersByRole,
  };
};

const getTourStats = async () => {
  const totalTourPromise = TourModel.countDocuments();

  const totalTourByTourTypePromise = TourModel.aggregate([
    //stage-1
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "type",
      },
    },

    //stage-2

    {
      $unwind: "$type",
    },
    //stage-3
    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const avgTourConstPromise = TourModel.aggregate([
    //stage-1
    {
      $group: {
        _id: null,
        avgCostFrom: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalTourByDivisionPromise = TourModel.aggregate([
    //stage-1
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },

    //stage-2

    {
      $unwind: "$division",
    },
    //stage-3
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalHigesBookedTourPromise = BookingModel.aggregate([
    //satage
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },

    //stage-2
    {
      $sort: { bookingCount: -1 },
    },
    //stage -3
    {
      $limit: 5,
    },

    //stage-4
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
        ],
        as: "tour",
      },
    },

    //stage-5

    {
      $unwind: "$tour",
    },
    //stage-6

    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const [
    totalTour,
    totalTourByTourType,
    avgTourConst,
    totalTourByDivision,
    totalHighestBookedTour,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypePromise,
    avgTourConstPromise,
    totalTourByDivisionPromise,
    totalHigesBookedTourPromise,
  ]);

  return {
    totalTour,
    totalTourByTourType,
    avgTourConst,
    totalTourByDivision,
    totalHighestBookedTour,
  };
};

const getBookingStats = async () => {
  const totalBookingPromise = BookingModel.countDocuments();

  const totalBookingStatusPromise = BookingModel.aggregate([
    //stage-2
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingPerTourPromise = BookingModel.aggregate([
    //stage-2
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    //stage-2
    {
      $sort: { bookingCount: -1 },
    },
    //stage-3
    {
      $limit: 10,
    },

    //stage-4
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },
    //stage-5
    {
      $unwind: "$tour",
    },
    //stage-5
    {
      $project: {
        bookingCount: 1,
        _id: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const avgGuestCountPerBookingPromise = BookingModel.aggregate([
    //stage-1
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: "$guestCount" },
      },
    },
  ]);

  const bookingLast7DaysPromise = BookingModel.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const bookingLast30DaysPromise = BookingModel.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const totalBookingOfUniqueUserPromise = BookingModel.distinct("user").then(
    (user: any) => user.length
  );

  const [
    totalBooking,
    totalBookingStatus,
    bookingPerTour,
    avgGuestCountPerBooking,
    bookingLast7Days,
    bookingLast30Days,
    totalBookingOfUniqueUser,
  ] = await Promise.all([
    totalBookingPromise,
    totalBookingStatusPromise,
    bookingPerTourPromise,
    avgGuestCountPerBookingPromise,
    bookingLast7DaysPromise,
    bookingLast30DaysPromise,
    totalBookingOfUniqueUserPromise,
  ]);

  return {
    totalBooking,
    totalBookingStatus,
    bookingPerTour,
    avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
    bookingLast7Days,
    bookingLast30Days,
    totalBookingOfUniqueUser,
  };
};

const getPaymentStats = async () => {
  const totalPaymentPromise = PaymentModel.countDocuments();

  const totalRevenuePromise = PaymentModel.aggregate([
    //stage-1
    {
      $match: { status: PAYMENT_STATUS.PAID },
    },

    //stage-2

    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const totalPaymentStatusPromise = PaymentModel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const avgPaymentAmountPromise = PaymentModel.aggregate([
    //stage-1
    {
      $group: {
        _id: null,
        avgPaymentAmount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGetewayDataPromise = PaymentModel.aggregate([
    //stage-1
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalPayment,
    totalPaymentStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGetewayData,
  ] = await Promise.all([
    totalPaymentPromise,
    totalPaymentStatusPromise,
    totalRevenuePromise,
    avgPaymentAmountPromise,
    paymentGetewayDataPromise,
  ]);

  return {
    totalPayment,
    totalPaymentStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGetewayData,
  };
};

export const StatsService = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
