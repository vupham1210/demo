import { Images } from '../model/Images.js';
import { __dirname } from "../path.js";
import dotenv from 'dotenv';

import fs from 'fs';
import { promisify } from 'util';

dotenv.config();

const ServerURI = process.env.SERVER_URI;

export const getFile = (req, res, next) => {
    var options = {
      root: __dirname + '\\uploads\\images',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
  
    var fileName = req.params.name
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err)
      }
    })
}

export const uploadSingle = async (req, res, next) => {

  const author = req.userId ? req.userId : '';

  let response = {
    title: "Lỗi xảy ra",
    message: "Đã có lỗi xảy ra khi tải lên tệp",
    type: 'warning',
    error: true,
    author: author.user_id ? author.user_id : 'không xác định',
  }

  if( author.user_id == '' ){
    res.status(203).json(response)
    return;
  }else{
    const allImages = await Images.find({author: req.userId.user_id});
    let sllImage =  Object.keys(allImages).length;
    if(sllImage > 3){
      response = {
        title: "Lỗi xảy ra",
        message: "Bạn không thể tiếp tục thêm ảnh",
        type: 'error',
        error: true,
        author: author.user_id ? author.user_id : 'không xác định',
      }
      return res.status(200).json(response)
    }
  }

  const file = req.file;

  var finalImg = {
    contentType: file.mimetype,
    image: file.filename,
    author: author.user_id,
    originalname: file.originalname,
    filesize: file.size
  };

  let Image;
    
  try {
    const validateImage = await Images.findOne({
      author: author.user_id,
      originalname: file.originalname,
      filesize: file.size
    });
    if(!validateImage){
        Image = await new Images(finalImg);
        await Image.save();
    } else {
      response = {
        title: "Lỗi xảy ra",
        message: "Tệp này đã tải lên trước đó",
        type: 'warning',
        error: true,
      }
    }
  } catch (error) {
    console.log(error);
  }

  if(!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }

  if(Image){
    response = {
      title: "Thành công",
      message: "Tải tệp lên thành công",
      type: 'success',
      error: true,
    }
    res.send(response)
  } else {
    res.status(400).json(response)
  }
}

export const library = async (req, res) => {
  const allImages = await Images.find({author: req.userId.user_id});
  let response = [];
  if(allImages){
    allImages.map((val, index) => {
      const FileName = val.image;
      const filePath = ServerURI + `/upload/images/${FileName}`;
      let  currentImage = {...val._doc, path:filePath };
      response.push(currentImage)
    })
    res.status(200).send(response)
  } else {
    res.status(400).json({message: "Không có hình ảnh nào được hiển thị"})
  }
}

export const removeImage = async (req, res) => {
  let response = {
    title: "Lỗi xảy ra",
    message: `Tệp này đã tải lên trước đó ${req.body.file_id}`,
    type: 'warning',
    error: true,
  }

  const unLinkAsync = promisify(fs.unlink);
  let deleteImage;

  try {
    const deleteImage = await Images.findByIdAndDelete(req.body.file_id);
    // const deletePath =  await unlinkAsync(req.body.file_path);

    if(deleteImage){
      response = {
        title: "Thành công",
        message: "Tải tệp lên thành công",
        type: 'success',
        error: true,
      }
      return res.status(200).json({message: 'Complete'});
    }
  } catch (error) {
    console.log(error)
  }

  return res.status(400).json(response);
}
