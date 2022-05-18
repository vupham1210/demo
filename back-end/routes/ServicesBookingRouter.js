import { Router } from "express";
import multer from 'multer';
import { getBooking, addBooking, updateBooking, deleteBooking } from '../controllers/servicesBookingController.js';
import { verifyToken } from '../helper/jwt_services.js';  

const BookingRouter = Router();

BookingRouter.get('/', verifyToken , getBooking);
BookingRouter.post('/add', verifyToken, addBooking);
BookingRouter.patch('/update' ,verifyToken, updateBooking);
BookingRouter.delete('/delete' ,verifyToken, deleteBooking);

export default BookingRouter;