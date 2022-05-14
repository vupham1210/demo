import multer from "multer";
import { verifyToken } from '../helper/jwt_services.js'; 
import { Router } from "express";

import { getFile, uploadSingle, library } from '../controllers/filesController.js';


const upload = multer({ dest: 'uploads/images/'});

const UploadRouter = Router();

UploadRouter.get('/images/:name', getFile);

UploadRouter.post("/", [verifyToken,  upload.single('uploaded_file')], uploadSingle);

UploadRouter.get("/images/", library);

export default UploadRouter;