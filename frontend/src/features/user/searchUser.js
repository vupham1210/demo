import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import  axios  from 'axios';

const searchUser = `${process.env.REACT_APP_SERVER_URL}/users/search`;


const initialState = { 
    status: 'idle',
}

// create Schedule Async
export const searchUserAsync = createAsyncThunk(
    'searchUser',
    async (data) => {
      const config = {
        url: `${searchUser}/?q=${data}`,
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

export const searchUserSlice = createSlice({
    name: 'searchUser',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
          .addCase(searchUserAsync.pending, (state, action) => {
            state.status = 'pending';
          })
          .addCase(searchUserAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            if(action.payload){
                state.data = action.payload;
            }
          })
      }
});


export const dataSearchUser = (state) => state.searchUser.data;
export const statusSearchUser = (state) => state.searchUser.status;

export default searchUserSlice.reducer;