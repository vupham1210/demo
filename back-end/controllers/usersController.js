import md5 from 'md5';
import { User } from '../model/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../helper/jwt_services.js';

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
      first_name:user.first_name,
      last_name:user.last_name,
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

export const getAllUsers = async (req, res, next) => {
  console.log('All User')
  let users;
   try {
     users = await User.find();
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
      
      response = {
        token: accesstoken,
        refreshToken: refreshtoken,
        expiredAt: Date.now() + (60 * 10 * 1000),
      };

      return res.status(200).json(response);

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
  const { 
    first_name, 
    last_name, 
    birth_day,
    personal_id,
    address,
    avatar,
  } = req.body;
  
  let user;
  try {
   user = await User.findOneAndUpdate({_id: req.userId.user_id}, {
        first_name:first_name,
        last_name:last_name,
        birth_day:birth_day,
        personal_id:personal_id,
        address:address,
        avatar:avatar,
    });
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(404).json('Không thể chỉnh sửa nội dung, lỗi đăng nhập');
  }
  return res.status(200).json({ user });
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(404).json({ message: "Unable To Delete By this ID" });
  }
  return res.status(200).json({ message: "User Successfully Deleted" });
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