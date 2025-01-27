import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userDetails:null,
    phone:""
    
  },
  reducers: {
    setUserDetails: (state, action) => {
        state.userDetails= action.payload;
      },
      setPhone: (state, action) => {
        state.phone= action.payload;
      },
   
  },
});

export const { setUserDetails,setPhone } = userSlice.actions;

export default userSlice.reducer;
