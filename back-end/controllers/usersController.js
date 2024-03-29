import md5 from 'md5';
import { User } from '../model/User.js';
import { Images } from '../model/Images.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../helper/jwt_services.js';
import { OAuth2Client } from "google-auth-library";
dotenv.config();

const ServerURI = process.env.SERVER_URI;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  
  const { idToken } = req.body;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      
      const { email_verified, name, email, picture } = response.payload;
      if (email_verified) {
        User.findOne({ username: email }).exec(async (err, user) => {
          if (user) {
            const accesstoken = await signAccessToken(user.id);
            const refreshtoken = await signRefreshToken(user.id);
            const updateRefreshToken = await User.findByIdAndUpdate(user._id, {refreshToken: refreshtoken});

            if(updateRefreshToken){
              console.log('update', user);
              response = {
                token: accesstoken,
                refreshToken: refreshtoken,
                expiredAt: Date.now() + (60 * 10 * 1000),
              };
        
              return res.status(200).json(response);
            }
          } else {
            user = new User({
              fullname: name,
              username: email,
              password: md5('123'),
              email: email,
              avatar: picture,
              role: 'subscriber',
            });
            user.save(async (err, data) => {
                if (err) {
                  console.log('error', err);
                  return res.status(400).json({
                    error: "User signup failed with google",
                    data
                  });
                }
                const accesstoken = await signAccessToken(data.id);
                const refreshtoken = await signRefreshToken(data.id);
                const updateRefreshToken = await User.findByIdAndUpdate(data._id, {refreshToken: refreshtoken});

                if(updateRefreshToken){
                  console.log('update', data);
                  response = {
                    token: accesstoken,
                    refreshToken: refreshtoken,
                    expiredAt: Date.now() + (60 * 10 * 1000),
                  };
            
                  return res.status(200).json(response);
                }
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again"
        });
      }
    });
};

export const getUserInfor = async (req, res, next) => {
  let user;
  try {
    user = await User.findOne({_id: req.userId.user_id });
  } catch (error) {
    console.log(error);
  }
  if(!user){
    return res.status(201).json('Lỗi đăng nhập');
  } else {
    const response = {
      fullname: user.fullname,
      address: user.address,
      avatar: user.avatar,
      birth_day: user.birth_day,
      email: user.email,
      personal_id: user.personal_id,
      phone: user.phone,
      role: user.role,
      username: user.username,
    }
    return res.status(200).json(response);
  }
};

export const getUserHandleInfor = async (req, res, next) => {
  if(req.userId.user_id) {
    let user;
    try {
      user = await User.findOne({_id: req.params.id });
    } catch (error) {
      console.log(error);
    }
    if(!user){
      return res.status(201).json({message: "Not Found User!!!"});
    } else {
      const response = {
        fullname: user.fullname,
        address: user.address,
        avatar: user.avatar,
        birth_day: user.birth_day,
        email: user.email,
        personal_id: user.personal_id,
        phone: user.phone,
        role: user.role,
        username: user.username,
      }
      return res.status(200).json(response);
    }
  }else{
    return res.status(404).json({ message: "Not Admin!!!" });
  }
};

export const changeRoleUser = async (req,res,next) =>{
  const user = await User.findById(req.params.id);
  const userAdmin = await User.findOne({_id: req.userId.user_id });
  if(!user) return res.status(404).json("User not found!!!");
  if(userAdmin.role == 'admin'){
    try{
      const updateUser = await User.findByIdAndUpdate(req.params.id,{
        role: req.query.role,
        typeU : req.query.typeU,
      });
      return res.status(200).json(updateUser);
    }catch (err) {
      console.log(err);
    }
  }else{
    return res.status(404).json({ message: "User not admin don't change role other user!!!"});
  }
}

export const getAllUsers = async (req, res, next) => {
  let users;
   try {
     if(req.query.role){
     users = await User.find({ role: req.query.role}).skip((req.query.page - 1) * req.query.perpage).limit(req.query.perpage);
    }else{
      users = await User.find();
    }
    } catch (err) {
     console.log(err);
   }

  if (!users) {
    return res.status(404).json({ message: "No Users found" });
  }
   return res.status(200).json({ users });
};

export const loginUser = async (req, res, next) => {

  let response = {
    title: "Lỗi xảy ra",
    message: "Đã có lỗi xảy ra trong quá trình đăng nhập, xin vui lòng thử lại!",
    type: 'warning',
    error: true,
  };
  const { username, password } = req.body;
  
  let user;
  try {
    user = await User.findOne({ username: username, password: md5(password) });
    if (!user) {
      response = {
        title: "Lỗi xảy ra",
        message: "Sai tên đăng nhập hoặc mật khẩu!",
        type: 'warning',
        error: true,
      };
      return res.status(201).json(response);
    } else {

      const accesstoken = await signAccessToken(user.id);
      const refreshtoken = await signRefreshToken(user.id);
      const updateRefreshToken = await User.findByIdAndUpdate(user._id, {refreshToken: refreshtoken});

      if(updateRefreshToken){
        console.log('update', user);
        response = {
          token: accesstoken,
          refreshToken: refreshtoken,
          expiredAt: Date.now() + (60 * 10 * 1000),
        };
  
        return res.status(200).json(response);
      }
    }

  } catch (err) {
    console.log(err);
  }
};

export const addUser = async (req, res, next) => {
  const { username, email, phone, password, role = 'subscriber'} = req.body;
  let response = {
    title: "Lỗi xảy ra",
    message: "Tên đăng nhập hoặc địa chỉ Email đã có người đăng ký, vui lòng thử lại",
    type: 'warning',
    error: true,
  };

  let user;
  try {
    user = new User({
      username:username,
      password:md5(password),
      email:email.toLowerCase(),
      phone:phone,
      role:role,
    });
    const validateUser = await User.findOne({ username: username });
    if(!validateUser){
      await user.save(); 
      response = {
        title: "Thành công",
        message: "Đã tạo thành công tài khoản",
        type: 'success',
        error: true,
      }
    } else {
      response = {
        title: "Lỗi xảy ra",
        message: "Tài khoản này được tạo, xin vui lòng thử lại với tên tài khoản khác",
        type: 'warning',
        error: true,
      }
    }
    
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    return res.status(500).json(response);
  }
  return res.status(201).json(response);
};

export const updateUser = async (req, res, next) => {
  let response = {
      title: "Lỗi xảy ra",
      message: "Đã có lỗi xảy ra trong quá trình",
      type: 'error',
      error: true,
      status: 201,
  };
  let user;
  try {
      const {
        fullname, 
        phone,
        birth_day,
        personal_id,
        address,
        avatar,
        email } = req.body ;
      user = await User.findOneAndUpdate({_id: req.userId.user_id}, {
        fullname: fullname,
        birth_day:birth_day,
        personal_id:personal_id,
        phone: phone,
        email:email,
        address:address,
        avatar:avatar,
      });
      if(user){
          response = {
              title: "Thành công",
              message: "Booking Updated",
              type: 'success',
              error: false,
              status: 200,
              data: user,
          };
          return res.status(200).json(response);
      }

  } catch (error) {
      console.log(error);
      response = {
          title: "Lỗi xảy ra",
          message: "Đã có lỗi xảy ra",
          type: 'error',
          error: true,
          status: 400,
      };
      return res.status(400).json(response);
  }
  return res.status(201).json(response);
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  const userAdmin = await User.findOne({_id: req.userId.user_id });
  let user;
  if(userAdmin.role == 'admin'){
    try {
      user = await User.findByIdAndDelete(id);
    } catch (err) {
      console.log(err);
    }
    if (!user) {
      return res.status(404).json({ message: "Unable To Delete By this ID" });
    }
    return res.status(200).json({ message: "User Successfully Deleted" });
  }else{
    return res.status(404).json({ message: "Bạn không phải admin nên không có quyền hạn này!!!" });
  }
};

// Refresh Token
export const getRefreshToken =  async (req, res, next) => {
  const { refreshtoken } = req.body;
  try {
    const { user_id } = await verifyRefreshToken(refreshtoken);
    if(user_id){
      const accessToken = await signAccessToken(user_id);
      const refreshNewtoken = await signRefreshToken(user_id);
      return res.status(200).json({ 
        token: accessToken,
        refreshToken: refreshNewtoken,
        expiredAt: Date.now() + (60 * 10 * 1000),
      });
    } else {
      return res.status(400).json('Refresh token không hợp lệ');
    }
  } catch (err) {
    console.log(err);
  }
  next();
};

export const searchUserByEmail = async (req , res) => {

  const reqQuery = {...req.query};
  const valueQuery = reqQuery.q;

  const UserSearchResult = await User.findOne(
      { email: valueQuery } 
  );

  res.status(200).json({
      success: true,
      data: UserSearchResult
  });
}