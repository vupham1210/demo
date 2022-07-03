import { Router } from "express";
import { verifyToken } from '../helper/jwt_services.js'; 
import { addSchedule, 
    getAllSchedule, 
    changeStatusSchedule,
    searchSchedules } from '../controllers/scheduleBookingController.js';

const ScheduleRouter = Router();

ScheduleRouter.post('/add', addSchedule);
ScheduleRouter.get('/all',verifyToken, getAllSchedule);
ScheduleRouter.patch('/change/:id',verifyToken,changeStatusSchedule);
ScheduleRouter.get('/search',searchSchedules);

export default ScheduleRouter;
 