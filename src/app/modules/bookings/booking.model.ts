import { model, Types, Schema } from "mongoose";

export interface IBooking {
  tourId: Types.ObjectId;
}

const bookingSchema = new Schema<IBooking>({
  tourId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export const BookingModel = model<IBooking>("Booking", bookingSchema);
