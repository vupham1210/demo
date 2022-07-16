import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance }  from '../Instance';
import Swal from "sweetalert2";


const createContact = `${process.env.REACT_APP_SERVER_URL}/contact/add`;


const initialState = { 
    status: 'idle',
}

// create Schedule Async
export const createContactAsync = createAsyncThunk(
    'createcontact',
    async (formData) => {
      const config = {
        url: createContact,
        method: 'post',
        data: formData,
      }
      const response = await AxiosInstance(config).then((res) => {
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

export const contactSlice = createSlice({
    name: 'createcontact',
    initialState,
    reducers: {
      setFormData: (state, action) => {
        console.log(action.payload)
        state.formData = {...action.payload}
      }
    },
    extraReducers: (builder) => {
        builder
          .addCase(createContactAsync.pending, (state, action) => {
            state.status = 'pending';
          })
          .addCase(createContactAsync.fulfilled, (state, action) => {
            state.status = 'idle';
          })
      }
});

export const { 
  setFormData
   } = contactSlice.actions;

export const dataContactForm = (state) => state.contactForm.formData;
export const statusContactForm = (state) => state.contactForm.status;

export default contactSlice.reducer;