import HotelCard from "@/components/HotelCard";
import { baseUrl } from "@/constants/server";
import {
  setSearchedHotels,
  setSelectedHotel,
} from "@/redux/reducers/hotelSlice";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import FastImage from "react-native-fast-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const { width } = Dimensions.get("window");




export default function Hotels() {
  const { location } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const hotels = useSelector((state: any) => state.hotel.searchedHotels);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
      const checkInDate=useSelector((state:any)=>state.hotel.checkInDate)
      const checkOutDate=useSelector((state:any)=>state.hotel.checkOutDate)
      const rooms=useSelector((state:any)=>state.hotel.rooms)

  const user=useSelector((state:any)=>state.user.userDetails)
// console.log(checkInDate, checkOutDate,user)
const [isVisible, setIsVisible] = useState(false);
const [modalMessage, setModalMessage] = useState("");
const [isSuccess, setIsSuccess] = useState(false);
    // console.log(checkInDate, checkOutDate)

  const closeModal = () => {
    setModalVisible(false);
  };

 

  const searchHotels = async () => {
      // console.log(location,checkInDate,checkOutDate,rooms)
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/hotels/hotels-by-dates`, {
        params: {
          qs: location,
          startDate:checkInDate,
          endDate:checkOutDate,
          roomsReq:rooms,
        },
      });

      const searchedHotels = res.data;
      dispatch(setSearchedHotels(searchedHotels));
      // console.log(searchedHotels,"Hotels");
      setLoading(false);
    } catch (error) {
      dispatch(setSearchedHotels([]));
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    searchHotels();
  }, [location]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f7f7f7",
        paddingHorizontal: 10,
      }}
    >
      {/* Loader */}
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <ActivityIndicator size="large" color="#ffb000" />
          <Text style={{ marginTop: 10, fontSize: 16, color: "#777" }}>
            Loading Hotels...
          </Text>
        </View>
      ) : (
        // Hotel Cards List
        <View
          style={{
             marginVertical:10,
             marginBottom:40

          }}
        >
          <Text style={{ fontSize: 20, fontFamily:"Poppins-Bold", marginBottom: 15,paddingHorizontal:5 }}>
           Available Hotels 
          </Text>
        
        <FlatList
          data={hotels}
          keyExtractor={(item) => item[0]._id}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 20, // Space between hotel cards
                borderRadius: 15,
                overflow: "hidden",
                backgroundColor: "#fff",
              }}
            >
              <HotelCard
                key={item[0]._id}
                hotel={item}
                
              />
            </View>
          )}
          
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No hotels available
            </Text>
          }
        />
        </View>
      )}

     
    </SafeAreaView>
  );
}
