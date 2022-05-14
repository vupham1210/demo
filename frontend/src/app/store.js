import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'

import counterReducer from '../features/counter/counterSlice';
import userReducer from '../features/user/userSlice';
import userLoginReducer from '../features/user/loginUser';
import refreshtokenReducer from '../features/user/refreshTokenSlice';
import createUserReducer from '../features/user/createUser';
import updateUserReducer from '../features/user/updateUser';
import mySaga from './sagas';

// disalbe thunk and add redux-saga middleware
const sagaMiddleware = createSagaMiddleware();

export default configureStore({
   reducer: {
      counter: counterReducer, 
      user: userReducer,
      userLogin: userLoginReducer,
      refreshtoken: refreshtokenReducer,
      updateUser: updateUserReducer,
      createUser: createUserReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
  }, 
);

sagaMiddleware.run(mySaga);