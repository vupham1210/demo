import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from '../Instance';


const getSchedule = `${process.env.REACT_APP_SERVER_URL}/schedule/all`;


const initialState = { 
    status: 'idle',
}

// get Schedule Async
export const getScheduleAsync = createAsyncThunk(
    'getschedule',
    async () => {
      const config = {
        url: getSchedule,
        method: 'get',
      }
      const response = await AxiosInstance(config).then((res) => {
        return res.data;
      }).catch(function (error) {
        console.log(error);
      });
      return response;
    }
);

export const getScheduleSlice = createSlice({
    name: 'getschedule',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
          .addCase(getScheduleAsync.pending, (state, action) => {
            state.status = 'pending';
          })
          .addCase(getScheduleAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            if(action.payload){
                state.data = action.payload;
            }
          })
      }
});


export const dataGetSchedule = (state) => state.schedules.data;
export const statusGetSchedule = (state) => state.schedules.status;

export default getScheduleSlice.reducer;