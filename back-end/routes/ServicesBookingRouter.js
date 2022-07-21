import { Router } from "express";
import multer from 'multer';
import { 
    getBooking, 
    addBooking, 
    updateBooking, 
    deleteBooking, 
    getBookingBySlug, 
    getBookingByIDUser,
    getBookingByID,
    updateBookingQty } from '../controllers/servicesBookingController.js';
import { verifyToken } from '../helper/jwt_services.js';  

const BookingRouter = Router();

BookingRouter.get('/', verifyToken , getBooking);
BookingRouter.post('/get' , getBookingBySlug);
BookingRouter.post('/add', verifyToken, addBooking);
BookingRouter.patch('/update' , verifyToken, updateBooking);
BookingRouter.delete('/delete/:id' , verifyToken, deleteBooking);

BookingRouter.get('/:iduser',getBookingByIDUser);
BookingRouter.get('/booking/:id', verifyToken,getBookingByID);
BookingRouter.post('/update-booking/:id', verifyToken, updateBookingQty);

export default BookingRouter;