import multer from "multer";
import { verifyToken } from '../helper/jwt_services.js'; 
import { Router } from "express";

import { getFile, uploadSingle, library, removeImage } from '../controllers/filesController.js';


const upload = multer({ dest: 'uploads/images/'});

const UploadRouter = Router();

UploadRouter.post("/", [verifyToken,  upload.single('uploaded_file')], uploadSingle);

UploadRouter.get('/images/:name', getFile);

UploadRouter.get("/images/", library);

UploadRouter.post("/delete/", verifyToken , removeImage);

export default UploadRouter;