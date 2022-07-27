import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from '../Instance';
import Swal from "sweetalert2";

const userUpdateAction = `${process.env.REACT_APP_SERVER_URL}/users/update`;
const createBooking = `${process.env.REACT_APP_SERVER_URL}/booking/add/`;

const initialState = { 
  status: 'idle',
  formData: {
    thumbnail: '',
    title: '',
    description:'',
    content: '',
    customfield: [],
    rangerDatePicker: false,
    startDate: '',
    endDate: '',
    time: []
  },
}

const FormList = [
  {
    name: 'Họ và tên',
    key: 'fullname',
    type: 'text'
  },{
    name: 'Địa chỉ Email',
    key: 'email',
    type: 'email'
  },{
    name: 'Số điện thoại',
    key: 'phone',
    type: 'text'
  },{
    name: 'Địa chỉ',
    key: 'address',
    type: 'text'
  }
];

// create Booking Async
export const createBookingAsync = createAsyncThunk(
  'createbooking',
  async (formData) => {
    const response = await AxiosInstance.post(createBooking, formData).then((res) => {
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
    setFormDataDefault : (state, action) => {
      state.formData  = {
        title: '',
        content: '',
        description: '',
        thumbnail: '',
        // Booking Post
        time: [],
        location: '',
        startDate: new Date(),
        customfield: FormList,
      }
    },
    setThumbnail: (state, action) => {
      state.formData.thumbnail = action.payload;
    },
    setGallery: (state, action) => {
      state.formData.gallery = action.payload;
    },
    addFormData: (state, action) => {
      console.log(action.payload);
    },
    addDateData: (state, action) => {
      console.log(action.payload);
      state.formData.startDate = action.payload.startDate;
      state.formData.endDate = action.payload.endDate;
    },

    addTimerData: (state, action) => {
      const PreviousState = state.formData.time;
      const payload = action.payload;
      state.formData.time = [...PreviousState, payload];
    },

    updateTimerData: (state, action) => {
      let PreviousState = state.formData.time;
      const payload = action.payload.value;
      const indexed = action.payload.index;
      PreviousState[indexed] = payload;
      state.formData.time = PreviousState;
    },

    removeTimerData: (state, action) => {
      let PreviousState = state.formData.time;
      let indexed = action.payload;
      indexed.map((val) => {
        PreviousState.splice(val, 1)
      })
      state.formData.time = PreviousState;
     }, 
     
    addTimeData:(state, action) => {
      const index = action.payload.index;
      const value = action.payload.value;
      state.formData.time[index].timeStart = value;
    }, 
    addEndTimeData:(state, action) => {
      const index = action.payload.index;
      const value = action.payload.value;
      state.formData.time[index].timeEnd = value;
    },
    addQtyData:(state, action) => {
      const index = action.payload.index;
      const value = action.payload.value;
      console.log(index, value);
      state.formData.time[index].qty = value;
    },
    setTitle:(state, action) => {
      state.formData.title = action.payload;
    },
    setDescription:(state, action) => {
      state.formData.description = action.payload;
    },
    setContent:(state, action) => {
      state.formData.content = action.payload;
    },
    setLocation:(state, action) => {
      state.formData.location = action.payload;
    },
    setDatePicker:(state, action ) => {
      state.formData.rangerDatePicker = !state.formData.rangerDatePicker;
    },
    removeField: (state, action) => {
      let PreviousState = state.formData.field;
      let indexed = action.payload;
      PreviousState.splice(indexed, 1)
      state.formData.customfield = PreviousState;
    },
    addField: (state, action) => {
      const PreviousState = state.formData.field;
      const payload = action.payload;
      state.formData.customfield = [...PreviousState, payload];
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

export const { 
              setFormDataDefault,
              setThumbnail,
              setGallery,
              addFormData,
              addDateData,
              addTimerData,
              removeTimerData,
              addTimeData,
              updateTimerData,
              addEndTimeData,
              addQtyData,
              setContent,
              setLocation,
              setTitle,
              setDescription,
              setDatePicker,
              addField,
              removeField,
              addFieldTitleData,
              addFieldContentData
               } = bookingSlice.actions;
export const dataHourState = (state) => state.bookingForm.hourState;
export const dataBookingForm = (state) => state.bookingForm.formData;
export const statusBookingForm = (state) => state.bookingForm.status;

export default bookingSlice.reducer;
