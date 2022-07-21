import { Router } from "express";
import { verifyToken } from '../helper/jwt_services.js'; 
import { addSchedule, 
    getAllSchedule, 
    changeStatusSchedule,
    searchSchedules,
    deleteSchedule } from '../controllers/scheduleBookingController.js';

const ScheduleRouter = Router();

ScheduleRouter.post('/add', addSchedule);
ScheduleRouter.get('/all',verifyToken, getAllSchedule);
ScheduleRouter.patch('/change/:id',verifyToken,changeStatusSchedule);
ScheduleRouter.get('/search',searchSchedules);
ScheduleRouter.delete('/delete/:id',verifyToken,deleteSchedule);

export default ScheduleRouter;
 