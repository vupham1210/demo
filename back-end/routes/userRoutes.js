import { Router } from "express";
import { 
  getAllUsers,
  getUserInfor,
  getUserHandleInfor,
  changeRoleUser,
  addUser, 
  loginUser, 
  updateUser, 
  deleteUser, 
  getRefreshToken,
  searchUserByEmail,
  googleLogin,
} from "../controllers/usersController.js";
  
import { verifyToken } from '../helper/jwt_services.js';          

import multer from 'multer';

const imageUpload = multer({ dest: 'uploads/images' });
const UserRouter = Router(); 

UserRouter.get("/alls", getAllUsers);
UserRouter.get("/search", searchUserByEmail);
UserRouter.post("/", verifyToken, getUserInfor);
UserRouter.get("/userhandle/:id",verifyToken, getUserHandleInfor);
UserRouter.patch("/userhandle/:id",verifyToken,changeRoleUser);
UserRouter.post("/add", addUser);
UserRouter.post("/login", loginUser);
UserRouter.post("/refresh-token", getRefreshToken);
UserRouter.patch("/update", verifyToken, imageUpload.single('avatar'), updateUser);
UserRouter.delete("/delete/:id",verifyToken, deleteUser);
UserRouter.post("/googlelogin",googleLogin);


export default UserRouter; 

