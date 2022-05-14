import axios from 'axios';
const getRefreshToken = `${process.env.REACT_APP_SERVER_URL}/users/refresh-token`;

export const refreshNewToken = async (refreshToken) => {
  var config = {
    method: 'post',
    url: getRefreshToken,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify({
      refreshtoken: refreshToken
    })
  };
  const response = await axios(config).then((res) => { return res.data; });
  localStorage.setItem('token', response.token);
  localStorage.setItem('refreshToken', response.refreshToken);
  localStorage.setItem('expiredAt', response.expiredAt);
  return response;
}

export const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001/',
  timeout: 3000,
  headers: {
      'Content-Type': 'application/json',
  },
})

AxiosInstance.interceptors.request.use( async (config) => {
  let token = localStorage.getItem('token');
  let refreshToken = localStorage.getItem('refreshToken');
  let expiredAt = localStorage.getItem('expiredAt');

  if( token != undefined){     
      if(expiredAt < Date.now()){
      const newToken = await refreshNewToken(refreshToken);
      token = newToken.token;
      refreshToken = newToken.token;
    }
  }
  config.headers.token = `bear ${token}`;
  return config;
})

AxiosInstance.interceptors.response.use((response) => {
  return response;
})