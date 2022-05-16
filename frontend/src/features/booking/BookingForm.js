import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from '../Instance';
import Swal from "sweetalert2";
const userUpdateAction = `${process.env.REACT_APP_SERVER_URL}/users/update`;

const initialState = {
  status: 'idle',
  hourState:[],
  formData: {
    thumbnail: '',
    gallery: [],
    title: '',
    content: '',
    field: [
      {
        fieldName: '',
        fieldContent: '',
      }
    ],
    date: '',
    time: [ 
      {
        timeStart : '',
        timeEnd: '',
        qty: '',
      }
    ]
  },
}

// create Booking Async
export const createBookingAsync = createAsyncThunk(
  'updateUser',
  async (formData) => {
    const response = await AxiosInstance.post(userUpdateAction, formData).then((res) => {
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

export const bookingSlice = createSlice({
  name: 'createbooking',
  initialState,
  reducers: {
    addFormData: (state, action) => {
      console.log(action.payload);
    },
    addTimerData: (state, action) => {
      const PreviousState = state.hourState;
      const payload = action.payload;
      state.hourState = [...PreviousState, payload];
    },
    removeTimerData: (state, action) => {
      let PreviousState = state.hourState;
      let indexed = action.payload;
      PreviousState.splice(indexed, 1)
      state.hourState = PreviousState;
    }, 
    addStartTimeData:(state, action) => {
      const index = action.payload.index;
      const value = action.payload.value;
      state.hourState[index].timeStart = value;
    }, 
    addEndTimeData:(state, action) => {
      const index = action.payload.index;
      const value = action.payload.value;
      state.hourState[index].timeEnd = value;
    },
    addQtyData:(state, action) => {
      const index = action.payload.index;
      const value = action.payload.value;
      state.hourState[index].qty = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingAsync.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(createBookingAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
  }
})

export const { addFormData, addTimerData, removeTimerData, addStartTimeData, addEndTimeData, addQtyData } = bookingSlice.actions;
export const dataHourState = (state) => state.bookingForm.hourState;
export const dataBookingForm = (state) => state.bookingForm.formData;
export const statusBookingForm = (state) => state.bookingForm.status;

export default bookingSlice.reducer;
