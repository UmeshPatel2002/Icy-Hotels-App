import { createSlice } from '@reduxjs/toolkit';

const hotelSlice = createSlice({
  name: 'hotel',
  initialState: {
    searchLocation:"Noida",
    searchedHotels:[],
    selectedHotel:[],
    hotels:[],
    searchLoader:false,
    checkInDate:"",
    checkOutDate:"",
    rooms:1
     
    
  },
  reducers: {
    setSearchLocation: (state, action) => {
        state.searchLocation= action.payload;
      },

      setSearchedHotels: (state, action) => {
        state.searchedHotels= action.payload;
      },
      
      setSelectedHotel: (state, action) => {
        state.selectedHotel= action.payload;
      },
      setHotels: (state, action) => {
        state.hotels= action.payload;
      },
      setSearchLoader: (state, action) => {
        state.searchLoader= action.payload;
      },
      setCheckInDate: (state, action) => {
        state.checkInDate= action.payload;
      },
      setCheckOutDate: (state, action) => {
        state.checkOutDate= action.payload;
      },
      setRooms: (state, action) => {
        state.rooms= action.payload;
      }

   
  },
});

export const { setSearchLocation ,setSearchedHotels,setSelectedHotel,setHotels,setSearchLoader,setCheckInDate,setCheckOutDate,setRooms} = hotelSlice.actions;

export default hotelSlice.reducer;
