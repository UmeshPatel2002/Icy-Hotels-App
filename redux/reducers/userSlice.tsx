import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userDetails:null,
    phone:"",
    latitude:null,
    longitude:null,
    userAddress:"", 
  },
  reducers: {
    setUserDetails: (state, action) => {
        state.userDetails= action.payload;
      },
      setPhone: (state, action) => {
        state.phone= action.payload;
      },
      setUserAddress: (state, action) => {
        state.userAddress= action.payload;
      },
      setLatitude: (state, action) => {
        state.latitude= action.payload;
      },
      setLongitude: (state, action) => {
        state.longitude= action.payload;
      },
      
   
  },
});

export const { setUserDetails,setPhone,setUserAddress,setLatitude,setLongitude } = userSlice.actions;

export default userSlice.reducer;
