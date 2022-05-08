import { Router } from "express";
import { getAllUsers, addUser, getById, updateUser, deleteUser } from "../controllers/usersController.js";

const UserRouter = Router(); 

UserRouter.get("/", getAllUsers);
UserRouter.post("/add", addUser);
UserRouter.get("/:id", getById);
UserRouter.put("/:id", updateUser);
UserRouter.delete("/:id", deleteUser);

export default UserRouter; 
