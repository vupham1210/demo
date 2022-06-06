import { Router } from "express";
import { 
  getAllUsers,
  getUserInfor, 
  addUser, 
  loginUser, 
  updateUser, 
  deleteUser, 
  getRefreshToken 
} from "../controllers/usersController.js";
  
import { verifyToken } from '../helper/jwt_services.js';          

import multer from 'multer';

const imageUpload = multer({ dest: 'uploads/images' });
const UserRouter = Router(); 

UserRouter.get("/alls", getAllUsers);
UserRouter.post("/", verifyToken, getUserInfor);
UserRouter.post("/add", addUser);
UserRouter.post("/login", loginUser);
UserRouter.post("/refresh-token", getRefreshToken);
UserRouter.post("/update", verifyToken, imageUpload.single('avatar'), updateUser);
UserRouter.delete("/delete/:id",verifyToken, deleteUser);

export default UserRouter; 

