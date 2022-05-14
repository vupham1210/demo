import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const userLoginAction = `${process.env.REACT_APP_SERVER_URL}/users/login`;

const initialState = {
  status: 'idle',
  isLoggedIn: false,
}

// Async Login User 
export const loginUserAsync = createAsyncThunk(
  'loginuser',
  async (formData) => {
    const response = await axios.post(userLoginAction, formData).then((res) => {
      return res.data;
    })
    return response;
  }

);

export const userLoginSlice = createSlice({
  name: 'userlogin',
  initialState,
  reducers:{
    loggoutUser: (state) => {
      state.isLoggedIn= false;
    }
  },
  // The `reducers` field lets us define reducers and generate associated actions
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoggedIn = true;
        if(action.payload){
          const { token, refreshToken, expiredAt } = action.payload
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('expiredAt', expiredAt);
        }
      })
  }
});

export const { updateUser, loggoutUser } = userLoginSlice.actions;

export const userLoginStatus = (state) => state.userLogin.status;
export const isLoggedInUser = (state) => state.userLogin.isLoggedIn;

export default userLoginSlice.reducer;
