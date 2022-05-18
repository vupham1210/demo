import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from '../Instance';
import Swal from "sweetalert2";

const getBooking = `${process.env.REACT_APP_SERVER_URL}/booking/`;

const initialState = {
  status: 'idle',
  data: '',
}

// create Booking Async
export const loadBookingAsync = createAsyncThunk(
  'loadbooking',
  async (formData) => {
    const response = await AxiosInstance.get(getBooking, formData).then((res) => {
      return res.data;
    }).catch(function (error) {
      console.log(error);
    });
    return response;
  }
);

export const managerBookingSlice = createSlice({
  name: 'createbooking',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBookingAsync.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(loadBookingAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
  }
})

export const dataHourState = (state) => state.bookingForm.hourState;
export const dataBookingServices = (state) => state.bookingForm.data;
export const statusBookingServices = (state) => state.bookingForm.status;

export default managerBookingSlice.reducer;
