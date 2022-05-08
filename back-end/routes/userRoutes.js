import { Router } from "express";
import { getAllUsers, 
        addUser, 
        getById, 
        updateUser, 
        deleteUser, 
        verifyToken 
        } 
          from "../controllers/usersController.js";


const UserRouter = Router(); 

UserRouter.get("/", getAllUsers);
UserRouter.post("/add", addUser);
UserRouter.post("/login", getById);
UserRouter.put("/update", verifyToken, updateUser);
UserRouter.delete("/:id", deleteUser);

export default UserRouter; 
