import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

const getBooking = `${process.env.REACT_APP_SERVER_URL}/booking/`;

const initialState = {
  status: 'idle',
  data: [],
}

// create Booking Async
export const getBookingByIdAsync = createAsyncThunk(
  'getbooking',
  async (userID) => {
    const response = await axios.get(`${getBooking}${userID}`).then((res) => {
      return res.data;
    }).catch(function (error) {
      console.log(error);
    });
    return response;
  }
);

export const getBookingByIdUserSlice = createSlice({
  name: 'getBookingByIdUser',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookingByIdAsync.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(getBookingByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        if(action.payload){
          state.data = action.payload;
        }
      })
  }
})


export const dataBookingById = (state) => state.bookingById.data;
export const statusDataBookingById = (state) => state.bookingById.status;

export default getBookingByIdUserSlice.reducer;
