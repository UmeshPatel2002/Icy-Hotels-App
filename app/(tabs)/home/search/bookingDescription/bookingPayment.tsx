import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Dimensions,

} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importing Expo icons
import { baseUrl } from "@/constants/server";
import { useSelector } from "react-redux";
import axios from "axios";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentScreen = () => {
  const router = useRouter();
  const {
    roomType,
    checkInDate,
    checkOutDate,
    numRooms,
    price,
    hotelImg,
    hotelId,
    hotelName,
  } = useLocalSearchParams();
  const user = useSelector((state: any) => state.user.userDetails);
  const [isVisible, setIsVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { width, height } = Dimensions.get("window");
 const [isPayNow, setIsPayNow] = useState(false);

  const handlePress = () => {
    if (!user?._id) {
      setShowLoginModal(true); // Open modal
    } else {
      confirmBooking(); // Proceed to book
    }
  };

  const confirmBooking = async () => {
    console.log("booking");

    try {
      const res = await axios.post(`${baseUrl}/booking/book-room`, {
        user: user?._id,
        room: hotelId,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        totalRooms: numRooms,
        status: "Confirmed",
        paymentStatus: "Pending",
        transactionId: "xyz",
        totalPrice: price,
      });

      if (res.data) {
        // console.log(res.data);
        setIsSuccess(true);
        setModalMessage("Booking Successful!");

        showPopup();
      } else {
        setIsSuccess(false);
        setModalMessage("Error booking hotel.");

        showPopup();
      }
    } catch (error) {
      console.error("Error booking hotel:", error);
      setIsSuccess(false);

      setModalMessage("Error booking hotel.");
      showPopup();
    }
  };

  const showPopup = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      router.back();
    }, 4000); // Hide the modal after 5 seconds
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f5f7" }}>
          <View style={{ flex: 1 }}>
            {/* Header Section */}
            <View
              style={{
                backgroundColor: "#fff",
                paddingVertical: 10,
                // marginVertical: 10,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#ccc",
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
                borderBottomWidth: 2,
                borderBottomColor: "#eeeeee",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: "#333",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontFamily: "Nunito-SemiBold",
                }}
              >
                Payment Invoice
              </Text>
            </View>
    
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Room Image Section */}
              <View
                style={{
                  marginVertical: 6,
                  borderRadius: 12,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  borderWidth: 1,
                  borderColor: "#ddd",
                }}
              >
                <Image
                  source={{ uri: `${hotelImg}` }} // Image URL from params
                  style={{
                    width: "100%",
                    height: 140,
                    resizeMode: "cover",
                    borderRadius: 10,
                  }}
                />
              </View>
    
              {/* Booking Details Section */}
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 16,
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 4 },
                  marginBottom: 30,
                  borderWidth: 1,
                  borderColor: "#ddd",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                    paddingBottom: 10,
                    fontFamily: "Nunito-Medium",
                  }}
                >
                  Booking Details
                </Text>
    
                {/* Room Type */}
                {/* Hotel Name Section */}
                <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 8,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                >
                  <Ionicons
                    name="business"
                    size={20}
                    color="#2980b9"
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#333",
                      fontFamily: "Nunito-SemiBold",
                      flex: 1,
                    }}
                  >
                    <Text>Hotel: </Text>
                    {hotelName}
                  </Text>
                </View>
    
                {/* Room Type Section with Card */}
                <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 8,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                >
                  <Ionicons
                    name="bed-outline"
                    size={20}
                    color="#8e44ad"
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#444",
                      fontFamily: "Nunito-Regular",
                      flex: 1,
                    }}
                  >
                    <Text
                      style={{ fontFamily: "Nunito-SemiBold", color: "#2c3e50" }}
                    >
                      Room Type:{" "}
                    </Text>
                    {roomType}
                  </Text>
                </View>
    
                {/* Check-In Date */}
                <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 8,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                >
                  <Ionicons
                    name="calendar"
                    size={20}
                    color="#f39c12"
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#333",
                      fontFamily: "Nunito-Regular",
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontFamily: "Nunito-SemiBold" }}>
                      Check-In:{" "}
                    </Text>
                    {checkInDate}
                  </Text>
                </View>
    
                {/* Check-Out Date */}
                <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 8,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                >
                  <Ionicons
                    name="calendar"
                    size={20}
                    color="#e74c3c"
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#333",
                      fontFamily: "Nunito-Regular",
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontFamily: "Nunito-SemiBold" }}>
                      Check-Out:{" "}
                    </Text>
                    {checkOutDate}
                  </Text>
                </View>
    
                {/* Number of Rooms */}
                <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 8,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                >
                  <Ionicons
                    name="bed-sharp"
                    size={20} // Slightly larger for better visibility
                    color="#8e44ad" // Elegant purple tone
                    style={{ marginRight: 12 }}
                  />
    
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#333",
                      fontFamily: "Nunito-Regular",
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontFamily: "Nunito-SemiBold" }}>Rooms: </Text>
                    {numRooms}
                  </Text>
                </View>
    
                {/* Price */}
                {/* <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 8,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                >
                  <Ionicons
                    name="cash"
                    size={22}
                    color="#2ecc71"
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "green",
                      fontWeight: "600",
                      flex: 1,
                      fontFamily: "Nunito-Medium",
                    }}
                  >
                    <Text
                      style={{
                        color: "#333",
                        fontFamily: "Nunito-SemiBold",
                      }}
                    >
                      Total:{" "}
                    </Text>
                    Rs. {price}
                  </Text>
                </View> */}
              </View>
    
              {/* payment success and failed animation modal */}
              <Modal visible={isVisible} transparent animationType="slide">
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                  }}
                >
                  {isSuccess && (
                    <LottieView
                      source={require("../../../../../assets/lottie/success.json")}
                      autoPlay
                      loop
                      style={{ width: width, height: height }} // Adjust size
                    />
                  )}
                  {isSuccess === false && (
                    <LottieView
                      source={require("../../../../../assets/lottie/failure.json")}
                      autoPlay
                      loop
                      style={{ width: width, height: height }} // Adjust size
                    />
                  )}
                </View>
              </Modal>
    
              {/* login modal */}
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
                        gap: 20,
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
                        onPress={() => {
                          setShowLoginModal(false);
                          router.push("/(tabs)/profile/login");
                        }}
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
            </ScrollView>
            <View
              style={{
                backgroundColor: "#f8f9fa",
                paddingBottom: 10,
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "#ddd",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 1 },
              }}
            >
              {/* Offer Section */}
    
              <View
                style={{
                  flexDirection: "row",
                  paddingVertical: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  width: width,
                  shadowOffset: { width: 0, height: 1 },
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "green",
                    fontFamily: "Nunito-Medium",
                  }}
                >
                  Pay Now {""}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#333",
                    fontFamily: "Nunito-Medium",
                  }}
                >
                  and get up to{" "}
                  <Text style={{ fontFamily: "Nunito-SemiBold", color: "#f39c12" }}>
                    5% extra off
                  </Text>
                </Text>
              </View>
    
              {/* Payment Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "80%",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FFF6DC",
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 6,
                    borderColor: "#fbb000",
                    borderWidth: 1,
                    marginRight: 10,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 3,
                  }}
                  onPress={() => {
                    handlePress();
                    console.log("Proceeding to payment...");
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        color: "#fbb000",
                        fontSize: 14,
                        fontFamily: "Nunito-SemiBold",
                        textTransform: "uppercase",
                      }}
                    >
                      Pay at Hotel
                    </Text>
    
                    <Text
                      style={{
                        color: "#fbb000",
                        fontSize: 16,
                        fontFamily: "Nunito-Bold",
                        textTransform: "uppercase",
                      }}
                    >
                      ₹{price}
                    </Text>
                  </View>
                </TouchableOpacity>
    
                <TouchableOpacity
                  style={{
                    backgroundColor: "#e8fceb",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 6,
                    borderColor: "green",
                    borderWidth: 1,
                    marginRight: 10,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 3,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    // handlePress();
                    setIsPayNow(true);
                    console.log("Proceeding to payment...");
                  }}
                  activeOpacity={0.7} // Reduces opacity when pressed
                >
                  <View style={{ alignItems: "center", gap: 4 }}>
                    {/* Pay Now Text */}
                    <Text
                      style={{
                        color: "green",
                        fontSize: 14,
                        fontFamily: "Nunito-SemiBold",
                        textTransform: "uppercase",
                      }}
                    >
                      Pay Now
                    </Text>
    
                    {/* Price Section */}
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {/* Strikethrough Original Price */}
                      <Text
                        style={{
                          textDecorationLine: "line-through",
                          color: "gray",
                          fontSize: 12,
                          fontFamily: "Nunito-SemiBold",
                          marginRight: 6,
                        }}
                      >
                        ₹{price}
                      </Text>
    
                      {/* Discounted Price */}
                      <Text
                        style={{
                          color: "green",
                          fontSize: 16,
                          fontFamily: "Nunito-Bold",
                        }}
                      >
                        ₹{Number(price) - (Number(price) * 5) / 100}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <Modal
              transparent={true}
              animationType="fade"
              visible={isPayNow}
              onRequestClose={() => setIsPayNow(false)}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 20,
                    borderRadius: 8,
                    alignItems: "center",
                    width: "80%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Nunito-SemiBold",
                      textAlign: "center",
                      marginBottom: 20,
                    }}
                  >
                    Sorry, online payment is not integrated.
                    Pay at your hotel room.
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "green",
                      paddingVertical: 8,
                      paddingHorizontal: 20,
                      borderRadius: 4,
                    }}
                    onPress={() => setIsPayNow(false)}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontFamily: "Nunito-SemiBold",
                        textTransform: "uppercase",
                      }}
                    >
                      OK
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </SafeAreaView>
  );
};

export default PaymentScreen;
