import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosInstance } from '../Instance';

import Swal from 'sweetalert2';

const userUpdateAction = `${process.env.REACT_APP_SERVER_URL}/users/update`;

const initialState = {
  status: 'idle',
  avatar: '',
  data: '',
}

// Async Update user
export const updateUserAsync = createAsyncThunk(
  'updateUser',
  async (formData) => {
    const response = await AxiosInstance.patch(userUpdateAction, formData).then((res) => {
      return res.data;
    }).catch(function (error) {
      console.log(error);
    });
    // The value we return becomes the `fulfilled` action payload
    Swal.fire(
      response.title,
      response.message,
      response.type
    ); 
    return response;
  }
);

export const updateUserSlice = createSlice({
  name: 'updateUser',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setAvatarUser: (state, action) => {
      state.avatar = action.payload;
    },
    removeUserInfor: (state) => {
      state.data = '';
      sessionStorage.clear();
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      }) 
  }
});

export const { setAvatarUser } = updateUserSlice.actions;

export const userUpdateStatus = (state) => state.updateUser.status;
export const userAvatar = (state) => state.updateUser.avatar;
export const userData = (state) => state.updateUser.data;
export default updateUserSlice.reducer;
