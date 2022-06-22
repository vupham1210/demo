import { Router } from "express";
import { verifyToken } from '../helper/jwt_services.js'; 
import { addSchedule , getAllSchedule} from '../controllers/scheduleBookingController.js';

const ScheduleRouter = Router();

ScheduleRouter.post('/add', addSchedule);
ScheduleRouter.get('/all',verifyToken, getAllSchedule);

export default ScheduleRouter;
 