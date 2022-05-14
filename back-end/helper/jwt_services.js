import jwt from 'jsonwebtoken';
import { client } from '../helper/connection_redis.js'; 

export const verifyToken = async (req, res, next) => {
  let token = req.headers.token;
  let decoded;
    token = token.split(' ')[1];
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.userId = decoded;
    } catch (err) {
      return res.status(401).send("Lỗi đăng nhập, Token không hợp lệ");
    }
    console.log('user:', req.userId);
    return next();
};

export const signAccessToken = async (userId) => {
  let accessToken;
  try {
    accessToken = await jwt.sign({user_id:userId}, process.env.ACCESS_TOKEN_SECRET,{
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    });
    return accessToken;
  } catch (error) {
    console.log(`Lỗi khi khởi tạo access token:  + ${error}`);
  }
}

export const signRefreshToken = async (userId) => {
  let refreshToken;
  try {
    refreshToken = await jwt.sign({user_id:userId}, process.env.REFRESH_TOKEN_SECRET,{
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
    });
    await client.set( userId.toString(), refreshToken, {'EX': 365 * 24 * 60 * 60});
    return refreshToken;
  } catch (error) {
    console.log(`Lỗi khi khởi tạo refresh token:  + ${error}`);
  }
}

export const verifyRefreshToken = async (refreshToken) => {
  let userId;
  let AvaiableRefreshToken;
  try {
    userId = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if(!err){
        return payload
      } else {
        console.log('Lỗi xác minh refreshToken:::', err.message);
      }
    })
    AvaiableRefreshToken = await client.get(userId.user_id.toString(), (err, reply) => {
      return reply;
    })
  } catch (error) {
    console.log(error);
  }

  if(AvaiableRefreshToken === refreshToken){
    return userId;
  } else {
    return '';
  }
}