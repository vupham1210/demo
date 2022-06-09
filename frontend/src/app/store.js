import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'

import counterReducer from '../features/counter/counterSlice';
import userReducer from '../features/user/userSlice';
import userLoginReducer from '../features/user/loginUser';
import refreshtokenReducer from '../features/user/refreshTokenSlice';
import createUserReducer from '../features/user/createUser';
import updateUserReducer from '../features/user/updateUser';
import bookingFormReducer from '../features/booking/BookingForm';
import mannagerBookingReducer from '../features/booking/ManagerBooking';
import managerSingleBookingReducer from '../features/booking/ManagerSingleBooking';
import vendorsReducer from '../features/user/getVendor';
import subcriberReducer from '../features/user/getSubcriber';

import libraryReducer from '../features/library/LibrarySlice';

import mySaga from './sagas';

// disalbe thunk and add redux-saga middleware
const sagaMiddleware = createSagaMiddleware();

export default configureStore({
   reducer: {
      counter: counterReducer, 
      vendors: vendorsReducer,
      subcribers: subcriberReducer,
      // User
      user: userReducer,
      userLogin: userLoginReducer,
      refreshtoken: refreshtokenReducer,
      updateUser: updateUserReducer,
      createUser: createUserReducer,
      // Booking 
      bookingForm: bookingFormReducer,
      managerBooking: mannagerBookingReducer,
      managerSingleBooking: managerSingleBookingReducer,
      // Library 
      library: libraryReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
  }, 
);

sagaMiddleware.run(mySaga);