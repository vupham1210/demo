import { Images } from '../model/Images.js';
import { __dirname } from "../path.js";
import dotenv from 'dotenv';

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
  console.log(req.userId);
  let response = {
    title: "Lỗi xảy ra",
    message: "Đã có lỗi xảy ra khi tải lên tệp",
    type: 'warning',
    error: true,
    author: req.userId.user_id ? req.userId.user_id : 'không xác định',
  }

  const author = req.userId ? req.userId.user_id : '';

  if( author == '' ){
    res.status(203).json(response)
    return;
  }

  const file = req.file;

  var finalImg = {
    contentType: file.mimetype,
    image: file.filename,
    author: req.userId,
    originalname: file.originalname,
    filesize: file.size
  };

  let Image;
    
  try {
    const validateImage = await Images.findOne(finalImg);
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

// Upload Multipe 
export const uploadMultipe = async (req, res, next) => {

  // let response = {
  //   title: "Lỗi xảy ra",
  //   message: "Đã có lỗi xảy ra khi tải lên tệp",
  //   type: 'warning',
  //   error: true,
  // }

  // const files = req.files;
  // console.log(files)
  
  // for (const single_file of files) {
  //   var finalImg = {
  //     contentType: single_file.mimetype,
  //     image: single_file.filename,
  //     author: 1
  //   };

  //   let Image;
    
  //   try {
  //     let validateImage = await Images.findOne(finalImg);
  //     if(!validateImage){
  //         Image = await new Images(finalImg);
  //         await Image.save();
  //     } else {
  //       response = {
  //         title: "Lỗi xảy ra",
  //         message: "Tệp này đã tải lên trước đó",
  //         type: 'warning',
  //         error: true,
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // if(files){
  //   response = {
  //     title: "Thành công",
  //     message: "Tải tệp lên thành công",
  //     type: 'success',
  //     error: true,
  //   }
  //   res.send(response)
  // } else {
  //   res.status(400).json(response)
  // }
  res.status(200).json(req.file)
}

export const library = async (req, res) => {
  const allImages = await Images.find();
  if(allImages){
    allImages.map((val, index) => {
      const filePath = ServerURI + `/upload/images/${val.image}`;
      allImages[index].image = filePath;
    })
    res.status(200).send(allImages)
  } else {
    res.status(400).json({message: "Không có hình ảnh nào được hiển thị"})
  }
  
}