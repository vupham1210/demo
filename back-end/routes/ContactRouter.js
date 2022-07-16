import { Router } from "express";
import { verifyToken } from '../helper/jwt_services.js'; 
import { addContact,
        getContactbyType,
        changeStatusContact } from '../controllers/contactsController.js';

const ContactRouter = Router();

ContactRouter.post('/add', verifyToken, addContact);
ContactRouter.get('/get', verifyToken, getContactbyType);
ContactRouter.patch('/change/:id', verifyToken, changeStatusContact);


export default ContactRouter;
 