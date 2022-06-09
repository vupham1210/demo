import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getVendorInforAction = `${process.env.REACT_APP_SERVER_URL}/users/alls`;

const initialState = {
    data: null,
    status: 'idle'
}

// Async Update user
export const getVendorsInforAsync = createAsyncThunk(
    'vendorsslice/getVendor',
    async () => {
      const link = `${getVendorInforAction}?role=vendor&page=1&perpage=6`;
      const response = await axios.get(link).then((res) => { return res.data.users; })
      return response;
    }
  );

export const vendorSLice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
          .addCase(getVendorsInforAsync.pending, (state) => {
            state.status = 'pending';
          })
          .addCase(getVendorsInforAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.data = action.payload;
          }) 
      }
});

export const VendorsData = (state) => state.vendors.data;
export const VendorsStatus = (state) => state.vendors.status;

export default vendorSLice.reducer;