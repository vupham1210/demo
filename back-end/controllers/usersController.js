import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { User } from '../model/User.js';

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

export const updateRefreshToken = async (username, refreshToken) => {
	try {
    await User.findOneAndUpdate({ username: username },{ refreshToken: refreshToken });
		return true;
	} catch {
		return false;
	} 
};

export const getById = async (req, res, next) => {

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
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    response = {
      title: "Lỗi xảy ra",
      message: "Sai tên đăng nhập hoặc mật khẩu!",
      type: 'warning',
      error: true,
    };
    return res.status(201).json(response);
  } else {

    const generatedToken = generateToken(user.username, user.email);

    response = {
      title: "Thành công",
      message: "Đăng nhập thành công!",
      type: 'success',
      error: true,
      user: {
        user_name: user.username,
        user_email: user.email,
        token: generatedToken.token,
        refreshToken: generatedToken.refreshtoken
      },
    };
  }
  return res.status(200).json(response);
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
  
  const { username, password, email} = req.body;
  
  let user;
  try {
   user = await User.findOneAndUpdate({username: username}, {
        username:username,
        password:password,
        email:email,
    });
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

// Generate Token
export const generateToken = (username, email) => {
	try {
    const token = jwt.sign( 
      {
        username: username, 
        email: email 
      },
        process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
      }
		);
    const refreshToken = jwt.sign( 
      {
        username:username
      }, 
      process.env.SECRET_TOKEN_REFRESH,
      { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    );
    let response = {
      status: "Đã đăng nhập",
      token: token,
      refreshtoken:refreshToken
    }
		return response 
	} catch (error) {
		console.log(`Lỗi khi khởi tạo access token:  + ${error}`);
		return null; 
	}
};

// Verify Token
export const verifyToken =  (req, res, next) => {
  let token =
    req.body.token || req.query.token || req.headers.token;
    token = token.split(' ')[1];
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.username = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
}

// Refresh Token
export const refreshToken =  async (req, res, next) => {
  const {refreshToken, username, email} = req.body
  let user;
  try {
    user = await User.findOne({ username: username, refreshToken: refreshToken });
  } catch (err) {
    console.log(err);
  }

  if(refreshToken && user) {
    const user = {
        username: req.username,
        email: req.email
    }
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.SECRET_TOKEN_REFRESH});
    const response = {
      "token": token,
    }
    res.status(200).json(response);
  }
  else {
      res.status(404).send('Invalid request')
  }
}