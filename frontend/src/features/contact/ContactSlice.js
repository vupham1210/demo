import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from '../Instance';


const getContact = `${process.env.REACT_APP_SERVER_URL}/contact/get`;


const initialState = { 
    status: 'idle',
}

// get Schedule Async
export const getContactAsync = createAsyncThunk(
    'getContact',
    async (data) => {
      const response = await AxiosInstance(`${getContact}/?type=${data}`).then((res) => {
        return res.data;
      }).catch(function (error) {
        console.log(error);
      });
      return response;
    }
);

export const getContactSlice = createSlice({
    name: 'getContact',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
          .addCase(getContactAsync.pending, (state, action) => {
            state.status = 'pending';
          })
          .addCase(getContactAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            if(action.payload){
                state.data = action.payload;
            }
          })
      }
});


export const dataGetContact = (state) => state.contacts.data;
export const statusGetContact = (state) => state.contacts.status;

export default getContactSlice.reducer;