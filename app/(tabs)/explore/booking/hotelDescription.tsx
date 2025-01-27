import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { baseUrl } from "@/constants/server";
import { formatDateRange } from "@/logics/logics";
import FastImage from "react-native-fast-image";


const HotelDescriptionScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const hotel = useSelector((state: any) => state?.hotel.selectedHotel);
  const router = useRouter();
  const imageHeight = 350;

  const [modalVisible, setModalVisible] = useState(false);
  const [dates, setDates] = useState("");
  const [roomsGuests, setRoomsGuests] = useState("");
  const [datesModal, setDatesModal] = useState(false);
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);
  const { width, height } = Dimensions.get("window");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null); // `null` for no check yet
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const checkInDate=useSelector((state:any)=>state.hotel.checkInDate)
  const checkOutDate=useSelector((state:any)=>state.hotel.checkOutDate)
  const user=useSelector((state:any)=>state.user.userDetails)
console.log("explore desc",checkInDate, checkOutDate,user,hotel?._id)
const [isVisible, setIsVisible] = useState(false);
const [modalMessage, setModalMessage] = useState("");
const [isSuccess, setIsSuccess] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

        const handlePress = () => {
          if (!user?._id) {
            setShowLoginModal(true); // Open modal
          } else {
            handleCheckAvailability(); // Proceed to book
          }
        };


  const updateRooms = (newRooms: number) => {
    console.log("newRooms", newRooms);
    if (newRooms < rooms && guests > newRooms * 2) return;
    setRooms(newRooms);
  };
  const updateGuests = (newGuestCount: number) => {
    const calculatedRooms = Math.ceil(newGuestCount / 2); // 2 guests per room
    setRooms(Math.max(rooms, calculatedRooms));
    setGuests(newGuestCount);
  };

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, imageHeight],
    outputRange: [0, -imageHeight / 2],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-imageHeight, 0],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={{ color: i <= rating ? "#ffb000" : "#ccc", fontSize: 16 }}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  const handleCheckAvailability = async () => {
    
    console.log(hotel, checkInDate,checkOutDate)
    if(!hotel?.hotelId?._id || !checkInDate || !checkOutDate || !rooms){
        alert("Please fill all fields")
        return;
    }
    setLoading(true);
    try {
        
      const res = await axios.get(`${baseUrl}/hotels/confirm-availability`, {
        params: {
          hotelId: hotel?.hotelId?._id, // Pass the correct hotel ID dynamically
          startDate: checkInDate, // Ensure proper date formatting
          endDate:checkOutDate, // Ensure proper date formatting
          roomsReq: rooms, 
        },
      });
         console.log(res.data)
      if (res.status === 200 && res.data) {
        console.log(res.data)
        setIsAvailable(true); 
        setShowModal(true); 
      } else {
        setIsAvailable(false); 
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setIsAvailable(false);
      setShowModal(true); // Show modal for error handling
    } finally {
      setLoading(false);
    }
  };
  
  const confirmBooking = async () => {
    console.log("confirming booking", rooms,user?._id,hotel?._id, rooms * hotel?.price);
    try {
      const res = await axios.post(`${baseUrl}/booking/book-room`, {
        user: user?._id,
        room: hotel?._id,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        totalRooms: rooms,
        status: "Confirmed",
        paymentStatus: "Paid",
        transactionId: "xyz",
        totalPrice: rooms * hotel?.price,
      });

      if (res.data) {
        console.log(res.data);
        setIsSuccess(true);
        setModalMessage("Booking Successful!");
        closeModal();
        showPopup();
      } else {
        setIsSuccess(false);
        setModalMessage("Error booking hotel.");
        closeModal();
        showPopup();
      }
    } catch (error) {
      console.error("Error booking hotel:", error);
      setIsSuccess(false);
      closeModal();
      setModalMessage("Error booking hotel.");
      showPopup();
    }
  }

  const showPopup = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 5000); // Hide the modal after 5 seconds
  };

  const closeModal = () => {
    setShowModal(false);
    setIsAvailable(null); // Reset availability state after closing modal
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      {/* Loader */}
      {!hotel ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <ActivityIndicator size="large" color="#ffb000" />
        </View>
      ) : (
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {/* Parallax Images */}
          <Animated.View
            style={{
              height: imageHeight,
              transform: [
                { translateY: headerTranslate },
                { scale: imageScale },
              ],
              overflow: "hidden",
            }}
          >
            <ScrollView horizontal pagingEnabled>
              {hotel?.hotelId?.images && hotel?.hotelId?.images?.map((img, index) => (
                <FastImage
                  key={index}
                  source={{ uri: img }}
                  style={{
                    width,
                    height: imageHeight,
                    borderRadius: 15,
                  }}
               resizeMode={FastImage.resizeMode.cover} // Correct usage of resizeMode

                />
              ))}
            </ScrollView>
          </Animated.View>

          {/* Hotel Details */}
          <View
            style={{
              padding: 15,
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginTop: -40,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            {/* Hotel Name */}
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 10,
              }}
            >
              {hotel?.hotelId?.name}
            </Text>

            {/* Hotel Category */}
            <Text
              style={{
                fontSize: 16,
                color: "#ffb000",
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              {hotel?.hotelId?.category}
            </Text>

            <View
              style={{
                marginBottom: 15,
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: "#fff",
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#ffb000",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                shadowColor: "#ffb000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#333",
                  fontWeight: "bold",
                  marginRight: 8,
                }}
              >
                Room Type
              </Text>

              <View
                style={{
                  backgroundColor: "#ffb000",
                  paddingVertical: 6,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {hotel?.roomType || "Standard Room"}
                </Text>
              </View>
            </View>

            {/* Hotel Address */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <MaterialIcons name="location-on" size={24} color="#ffb000" />
              <Text
                style={{
                  fontSize: 14,
                  color: "#555",
                  marginLeft: 8,
                }}
              >
                {hotel?.hotelId?.hotelAddress}
              </Text>
            </View>

            {/* Hotel Description */}
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                color: "#555",
                marginBottom: 20,
              }}
            >
              {hotel?.hotelId?.description}
            </Text>

            {/* Price Section */}
            <View
              style={{
                paddingVertical: 10,
                marginBottom: 20,
                borderRadius: 10,
                backgroundColor: "#f7f7f7",
                borderWidth: 1,
                borderColor: "#ffb000",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#ffb000",
                  marginBottom: 5,
                }}
              >
                ₹{hotel?.price} / night
              </Text>
              <Text style={{ fontSize: 14, color: "#777" }}>Special offer</Text>
            </View>

            {/* Amenities */}
            <View
              style={{
                marginBottom: 20,
                padding: 15,
                backgroundColor: "#fff8e5",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ffb000",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#333",
                }}
              >
                Amenities:
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {hotel?.hotelId?.hotelAmenities && hotel?.hotelId?.hotelAmenities?.map((amenity, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#ffb000",
                      borderRadius: 5,
                      padding: 8,
                      margin: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {amenity}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Ratings */}
            <View
              style={{
                marginBottom: 20,
                backgroundColor: "#f7f7f7",
                padding: 15,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ffb000",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#333",
                }}
              >
                Ratings & Reviews:
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
  {renderStars(hotel?.hotelId?.ratings?.totalRating || 0)}
  <Text
    style={{
      fontSize: 16,
      color: "#777",
      marginLeft: 8,
    }}
  >
    ({hotel?.hotelId?.ratings?.totalUsers || 0} reviews)
  </Text>
</View>
            </View>

            <View
              style={{
                padding: 15,
                backgroundColor: "#fff",
                borderRadius: 10,
                marginHorizontal: 5,
                shadowColor: "#bdbdbd",
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 8,
                marginBottom: 10,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 10,
                  backgroundColor: "#fff",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Medium",
                    fontSize: 14,
                    fontWeight: 100,
                    paddingHorizontal: 5,
                    textAlign:"center"
                  }}
                >
                  Select Dates & Room
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 12,
                    paddingHorizontal: 5,
                    textAlign:"center"
                  }}
                >
                  (For checking availability)
                </Text>
                
              </View>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/(tabs)/explore/booking/setDatesAvailable");
                  }}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 5,
                    padding: 10,
                    paddingHorizontal: 5,
                    marginBottom: 10,
                    backgroundColor: "#fff",
                    marginRight: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 12,
                      fontWeight: "100",
                      paddingHorizontal: 5,
                    }}
                  >
                    Dates
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 14,
                      paddingHorizontal: 5,
                    }}
                  >
                    {formatDateRange(checkInDate, checkOutDate)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setDatesModal(true);
                  }}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 5,
                    padding: 10,
                    paddingHorizontal: 5,
                    marginBottom: 10,
                    backgroundColor: "#fff",
                    marginLeft: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 12,
                      fontWeight: "100",
                      paddingHorizontal: 5,
                    }}
                  >
                    Rooms & Guest
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 14,
                      paddingHorizontal: 5,
                    }}
                  >
                    {rooms} Room - {guests} Guest
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
        style={{
            backgroundColor: "#ffb000",
            paddingVertical: 15,
            borderRadius: 30,
            alignItems: "center",
            marginBottom: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            marginTop:10
        }}
        onPress={()=>{handlePress()}}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Check Availability
          </Text>
        )}
      </TouchableOpacity>

              
            </View>

            {/* Book Now Button */}
        
    

      {/* Modal for showing availability */}
      
    </View>
         
        </Animated.ScrollView>
      )}
<Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
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
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 20,
              alignItems: "center",
              width: "80%",
            }}
          >
            {isAvailable ? (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Room is available! Confirm your booking?
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Room is not available.
              </Text>
            )}
            {isAvailable && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#4caf50",
                  paddingVertical: 15,
                  paddingHorizontal: 30,
                  borderRadius: 30,
                  alignItems: "center",
                  marginTop: 10,
                }}
                onPress={() => {
                  confirmBooking()
                  console.log("Room booking confirmed!");
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Confirm Booking
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                marginTop: 20,
              }}
              onPress={closeModal}
            >
              <Text
                style={{
                  color: "#ff0000",
                  fontSize: 16,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    

      <Modal
        visible={datesModal}
        animationType="slide"
        onRequestClose={()=>setDatesModal(false)}
        onDismiss={()=>setDatesModal(false)}
      
        transparent={true}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 10
        }}>
          <View style={{
            width: width,
            height: height * 0.5,
            position: 'absolute',
            bottom: 0,
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 16,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0 }}>
              <Text style={{ fontSize: 18, fontFamily: 'Poppins-SemiBold', marginBottom: 20 }}>Select Room & Guests</Text>
              <TouchableOpacity onPress={() => { setDatesModal(false) }}>
                <Entypo name="cross" size={28} color="black" />
              </TouchableOpacity>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontSize: 14, marginRight: 10, fontFamily: 'Poppins-Regular' }}>Number of Guests:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => updateGuests(guests - 1 < 1 ? 1 : guests - 1)}>
                  <Ionicons name="remove-circle-outline" size={24} color="#ffb000" />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, marginHorizontal: 10 }}>{guests}</Text>
                <TouchableOpacity onPress={() => updateGuests(guests + 1)}>
                  <Ionicons name="add-circle-outline" size={24} color="#ffb000" />
                </TouchableOpacity>
              </View>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <Text style={{ fontSize: 14, marginRight: 10, fontFamily: 'Poppins-Regular' }}>Number of Rooms:</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <TouchableOpacity onPress={() => updateRooms(rooms - 1 < 1 ? 1 : rooms - 1)}>
                  <Ionicons name="remove-circle-outline" size={24} color="#ffb000" />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, marginHorizontal: 10 }}>{rooms}</Text>
                <TouchableOpacity onPress={() => updateRooms(rooms + 1)}>
                  <Ionicons name="add-circle-outline" size={24} color="#ffb000" />
                </TouchableOpacity>
              </View>

            </View>


            {/* <Button title="Close" onPress={closeModal} /> */}
          </View>
        </View>
      </Modal>
      <Modal visible={isVisible} transparent animationType="slide">
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
      </Modal>

      
                  <Modal
            animationType="slide"
            transparent={true}
            visible={showLoginModal}
            onRequestClose={() => setShowLoginModal(false)}
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
                <View
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
                    onPress={()=>{router.push("/(tabs)/profile/login")}}
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
                    onPress={() => setShowLoginModal(false)}
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
          </Modal>
    </View>
  );
};

export default HotelDescriptionScreen;
