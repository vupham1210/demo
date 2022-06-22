import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from '../Instance';
import Swal from "sweetalert2";

const getBooking = `${process.env.REACT_APP_SERVER_URL}/booking/get`;

const initialState = {
  status: 'idle',
  data: '',
  formdata: '',
}

// create Booking Async
export const loadSingBookingAsync = createAsyncThunk(
  'loadbooking',
  async (Slug) => {
    let params = { slug: Slug}
    const response = await AxiosInstance.post(getBooking, params).then((res) => {
        return res.data;
    }).catch(function (error) {
      console.log(error);
    });
    return response;
  }
);

export const managerSingleBookingSlice = createSlice({
  name: 'createbooking',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSingBookingAsync.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(loadSingBookingAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
      })
  }
})

export const dataSingleBookingServices = (state) => state.managerSingleBooking.data;
export const statusSingleBookingServices = (state) => state.managerSingleBooking.status;



export default managerSingleBookingSlice.reducer;
