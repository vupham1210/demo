import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getSubcriberInforAction = `${process.env.REACT_APP_SERVER_URL}/users/alls`;

const initialState = {
    data: null,
    status: 'idle'
}

// Async Update user
export const getSubscribersInforAsync = createAsyncThunk(
    'subscribersslice/getSubscriber',
    async () => {
      const link = `${getSubcriberInforAction}?role=subscriber&page=1&perpage=10`;
      const response = await axios.get(link).then((res) => { return res.data.users; })
      return response;
    }
  );

export const subscriberSLice = createSlice({
    name: 'subscriber',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
          .addCase(getSubscribersInforAsync.pending, (state) => {
            state.status = 'pending';
          })
          .addCase(getSubscribersInforAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.data = action.payload;
          }) 
      }
});

export const SubcribersData = (state) => state.subcribers.data;
export const SubcribersStatus = (state) => state.subcribers.status;

export default subscriberSLice.reducer;