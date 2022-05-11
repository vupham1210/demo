import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../features/user/userSlice';
import userLoginReducer from '../features/user/loginUser';
import refreshtokenReducer from '../features/user/refreshTokenSlice';
import createUserReducer from '../features/user/createUser';

export const store = configureStore({
  reducer: {
    counter: counterReducer, 
    user: userReducer,
    userLogin: userLoginReducer,
    refreshtoken: refreshtokenReducer,
    createUser: createUserReducer
  },
});
