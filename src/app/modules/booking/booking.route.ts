import { Router } from "express";
import { checkAuth } from "../../middlewares/checkIsAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validadeRequest";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";
import { BookingController } from "./booking.controller";


const router = Router()

//api/v1/booking

router.post('/',checkAuth(...Object.values(Role)),validateRequest(createBookingZodSchema),BookingController.handleCreateBooking
)


//get all bookings route
router.get('/',checkAuth(Role.ADMIN,Role.SUPER_ADMIN),BookingController.handleGetAllBookings)

//get a user booking route
router.get('/my-bookings',checkAuth(...Object.values(Role)),BookingController.handleGetUserBooking)

//get a bookings route
router.get('/:bookingId',checkAuth(...Object.values(Role)),BookingController.handleGetSingleBooking)

//update bookings status route
router.get('/:bookingId/status',checkAuth(...Object.values(Role)) ,validateRequest(updateBookingStatusZodSchema),BookingController.handleUpdateBookingStatus)




export const BookingRoutes =router