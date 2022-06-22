import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import  axios  from 'axios';
import Swal from "sweetalert2";


const createSchedule = `${process.env.REACT_APP_SERVER_URL}/schedule/add`;


const initialState = { 
    status: 'idle',
}

// create Schedule Async
export const createScheduleAsync = createAsyncThunk(
    'createschedule',
    async (formData) => {
      const config = {
        url: createSchedule,
        method: 'post',
        data: formData,
      }
      const response = await axios(config).then((res) => {
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

export const scheduleSlice = createSlice({
    name: 'createschedule',
    initialState,
    reducers: {
      setFormData: (state, action) => {
        console.log(action.payload)
        state.formData = {...action.payload}
      }
    },
    extraReducers: (builder) => {
        builder
          .addCase(createScheduleAsync.pending, (state, action) => {
            state.status = 'pending';
          })
          .addCase(createScheduleAsync.fulfilled, (state, action) => {
            state.status = 'idle';
          })
      }
});

export const { 
  setFormData
   } = scheduleSlice.actions;

export const dataScheduleForm = (state) => state.scheduleForm.formData;
export const statusScheduleForm = (state) => state.scheduleForm.status;

export default scheduleSlice.reducer;