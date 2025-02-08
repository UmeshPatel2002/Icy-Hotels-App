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
      
        // const [showModal, setShowModal] = useState(false);

        // const handlePress = () => {
        //   if (!user?._id) {
        //     setShowModal(true); // Open modal
        //   } else {
            
        //     router.push("/(tabs)/home/search/bookingDescription");
        //   }
        // };

    const handleScroll = (event: any) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      setActiveIndex(newIndex);
    };
  
    // const handleBookNow = () => {
    //   setModalVisible(true);
    // };
  
  
    // const confirmBooking = async () => {
    //   // console.log("confirming booking", rooms,user?._id,hotel[0]?._id, rooms * hotel?.price);
    //   try {
    //     setLoading(true);
    //     const res = await axios.post(`${baseUrl}/booking/book-room`, {
    //       user: user?._id,
    //       room: hotel?._id,
    //       checkInDate: checkInDate,
    //       checkOutDate: checkOutDate,
    //       totalRooms: rooms,
    //       status: "Confirmed",
    //       paymentStatus: "Paid",
    //       transactionId: "xyz",
    //       totalPrice: rooms * hotel?.price,
    //     });
  
    //     if (res.data) {
    //       // console.log(res.data);
    //       setIsSuccess(true);
    //       setModalMessage("Booking Successful!");
    //     setLoading(false);

    //       closeModal();
    //       showPopup();
    //     } else {
    //       setIsSuccess(false);
    //     setLoading(false);

    //       setModalMessage("Error booking hotel.");
    //       closeModal();
    //       showPopup();
    //     }
    //   } catch (error) {
    //     console.error("Error booking hotel:", error);
    //     setIsSuccess(false);
    //     setLoading(false);

    //     closeModal();
    //     setModalMessage("Error booking hotel.");
    //     showPopup();
    //   }
    // }

    // const showPopup = () => {
    //     setIsVisible(true);
    //     setTimeout(() => {
    //       setIsVisible(false);
    //     }, 5000); // Hide the modal after 5 seconds
    //   };
    
      // const closeModal = () => {
      //   setModalVisible(false);
       
      // };
    
  
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
              fontWeight: "bold",
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
              <Text style={{ fontSize: 14, color: "#ffb000" }}>
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
            <Text style={{ fontSize: 14, color: "#ffb000" }}>
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
              router.push("/(tabs)/home/search/bookingDescription");
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <View
            style={{
              width: width * 0.8,
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 15,
              }}
            >
              Confirm Booking
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#555",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Are you sure you want to book this room?
            </Text>

           
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
              disabled={loading}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 30,
                  marginHorizontal: 10,
                  backgroundColor: "#ffb000",
                  alignItems: "center",
                }}
                onPress={confirmBooking}
              >
                {
                    loading ?
                    <ActivityIndicator size="small" color="#fff" />:
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
                      Yes, Confirm
                    </Text>
                }
               
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 30,
                  marginHorizontal: 10,
                  backgroundColor: "#ccc",
                  alignItems: "center",
                }}
                onPress={closeModal}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}

      {/* <Modal visible={isVisible} transparent animationType="slide">
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View
                  style={{
                    padding: 20,
                    borderRadius: 10,
                    width: "80%",
                    alignItems: "center",
                    backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
                    borderColor: isSuccess ? "#c3e6cb" : "#f5c6cb",
                    borderWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: isSuccess ? "#155724" : "#721c24",
                    }}
                  >
                    {modalMessage}
                  </Text>
                </View>
              </View>
            </Modal> */}

            {/* <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      >
        <View
          style={{
            width: width * 0.8,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#333",
              marginBottom: 15,
            }}
          >
            Please Sign Up or Log In
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#555",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            You need an account to book a room.
          </Text>

          {/* Action Buttons */}
          {/* <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              width: "70%",
              gap:20
            }}
          >
            <TouchableOpacity
              style={{
            
                paddingVertical: 12,
                borderRadius: 30,
                marginHorizontal: 10,
                backgroundColor: "#ffb000",
                alignItems: "center",
              }}
              onPress={()=>{setShowModal(false);router.push("/(tabs)/profile/login")}}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                Login / SignUp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                
                paddingVertical: 12,
                borderRadius: 30,
                marginHorizontal: 10,
                backgroundColor: "#ccc",
                alignItems: "center",
              }}
              onPress={() => setShowModal(false)}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal> */} 
      </View>
    );
  };

  export default HotelCard