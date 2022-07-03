import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "../Instance";
import Swal from "sweetalert2";

const getBooking = `${process.env.REACT_APP_SERVER_URL}/booking`;

const initialState = {
  status: 'idle',
  data: [],
}

// create Booking Async
export const getBookingByIdAsync = createAsyncThunk(
  'getBookingByID',
  async (id) => {
    const response = await AxiosInstance.get(`${getBooking}/booking/${id}`).then((res) => {
      return res.data;
    }).catch(function (error) {
      console.log(error);
    });
    return response;
  }
);

export const getBookingByIdSlice = createSlice({
  name: 'getBookingById',
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


export const dataBookingById = (state) => state.booking.data;
export const statusDataBookingById = (state) => state.booking.status;

export default getBookingByIdSlice.reducer;
