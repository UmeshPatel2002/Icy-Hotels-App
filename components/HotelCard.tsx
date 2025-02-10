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
  Button,
} from "react-native";
import FastImage from "react-native-fast-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const { width } = Dimensions.get("window");


const HotelCard = ({ hotel }: any) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const dispatch = useDispatch();
   
        const checkInDate=useSelector((state:any)=>state.hotel.checkInDate)
        const checkOutDate=useSelector((state:any)=>state.hotel.checkOutDate)
        const rooms=useSelector((state:any)=>state.hotel.rooms)
  
    const user=useSelector((state:any)=>state.user.userDetails)
  // console.log(checkInDate, checkOutDate,user)
  const [isVisible, setIsVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
      // console.log(checkInDate, checkOutDate)
      // console.log(hotel,"hotel");
        const [modalVisible, setModalVisible] = useState(false);
        const [loading,setLoading] = useState(false);
      
      

    const handleScroll = (event: any) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      setActiveIndex(newIndex);
    };
  
    
  
    return (
      <View
        key={hotel[0]?._id}
        style={{
          backgroundColor: "#fff",
          marginVertical: 15,
          borderRadius: 15,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        {/* Carousel Section */}
        <View style={{ position: "relative" }}>
          <ScrollView
            horizontal
            pagingEnabled
            style={{ height: 220 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          >
            {hotel[0]?.images &&
              hotel[0]?.images.map((img:any, index:any) => (
                <FastImage
                  key={index}
                  source={{ uri: img }}
                  style={{
                    width: width - 20,
                    height: 220,
                   
                  }}
                  resizeMode={FastImage.resizeMode.cover} // Correct usage of resizeMode
  
                />
              ))}
          </ScrollView>
  
          {/* Carousel Indicators */}
          <View
            style={{
              position: "absolute",
              bottom: 10,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {hotel[0]?.images?.map((_:any, index:any) => (
              <View
                key={index}
                style={{
                  height: 8,
                  width: 8,
                  backgroundColor: index === activeIndex ? "#ffb000" : "#ddd",
                  borderRadius: 4,
                  marginHorizontal: 2,
                }}
              />
            ))}
          </View>
        </View>
  
        {/* Hotel Details */}
        <View style={{ padding: 15 }}>
          {/* Hotel Name */}
          <Text
            style={{
              fontSize: 20,
              fontFamily:"Nunito-SemiBold",
              marginBottom: 5,
              color: "#333",
            }}
          >
            {hotel[0]?.name}
          </Text>
          
          {/* Address */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color="#ffb000" // Customize color to fit the theme
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                fontSize: 14,
                color: "#777",
                fontFamily:"Nunito-Regular",
              }}
            >
              {hotel[0]?.hotelAddress}
            </Text>
          </View>
  
          {/* Highlighted Info */}
          <View
            style={{
              flexDirection: "row",
              // justifyContent: "space-between",
              gap:20,
              marginBottom: 16,
            }}
          >
               <View
              style={{
                backgroundColor: "#ffecd0",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ fontSize: 14,fontFamily:"Nunito-Regular", color: "#ffb000" }}>
                Starts From Rs.{hotel[1]?.price}/night
              </Text>
            </View>
            {(hotel[0]?.ratings.totalUsers>0 && hotel[0]?.ratings.totalRating>0)?
            <View
            style={{
              backgroundColor: "#ffecd0",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 14,fontFamily:"Nunito-Regular", color: "#ffb000" }}>
              Rating: {hotel[0]?.ratings.totalRating/hotel[0]?.ratings.totalUsers} ⭐
            </Text>
          </View>:null
            
          }
           
          </View>
  
          {/* Book Now Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#ffb000",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={() => {
              dispatch(setSelectedHotel(hotel));
              router.push("/(tabs)/home/search/bookingDescription");
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontFamily:"Nunito-SemiBold",
              }}
            >
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  export default HotelCard