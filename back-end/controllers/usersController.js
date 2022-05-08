import { User } from '../model/User.js';
import md5 from 'md5';

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

export const getById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(404).json({ message: "No User found" });
  }
  return res.status(200).json({ user });
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
      email:email,
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
  const id = req.params.id;
  const { username, password, email, phone, address, image } = req.body;
  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
        username,
        password,
        email,
        phone,
        address,
        role,
        image,
    });
    user = await user.save();
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(404).json({ message: "Unable To Update By this ID" });
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