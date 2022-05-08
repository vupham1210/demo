import express, { Router } from "express";
import { User } from "../model/User.js";
import { getAllUsers, addUser, getById, updateUser, deleteUser } from "../controllers/usersController.js";

const router = Router(); 

router.get("/", getAllUsers);
router.post("/", addUser);
router.get("/:id", getById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;