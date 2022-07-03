import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import  axios  from 'axios';
import Swal from "sweetalert2";


const searchSchedule = `${process.env.REACT_APP_SERVER_URL}/schedule/search`;


const initialState = { 
    status: 'idle',
}

// create Schedule Async
export const searchScheduleAsync = createAsyncThunk(
    'searchSchedules',
    async (data) => {
      const config = {
        url: `${searchSchedule}/?q=${data}`,
        method: 'get',
      }
      const response = await axios(config).then((res) => {
        return res.data;
      }).catch(function (error) {
        console.log(error);
      });
      return response;
    }
);

export const searchScheduleSlice = createSlice({
    name: 'searchSchedules',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
          .addCase(searchScheduleAsync.pending, (state, action) => {
            state.status = 'pending';
          })
          .addCase(searchScheduleAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            if(action.payload){
                state.data = action.payload;
            }
          })
      }
});


export const dataSearchSchedule = (state) => state.searchSchedule.data;
export const statusSearchSchedule = (state) => state.searchSchedule.status;

export default searchScheduleSlice.reducer;