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
        paymentStatus: "Paid",
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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#f4f5f7",
        padding: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingVertical: 10,
          marginVertical: 10,
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
            fontFamily: "Poppins-SemiBold",
          }}
        >
          Payment Invoice
        </Text>
      </View>

      {/* Room Image Section */}
      <View
        style={{
          marginBottom: 6,
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
            fontFamily: "Poppins-Medium",
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
            style={{ fontSize: 15, color: "#333", fontWeight: "700", flex: 1 }}
          >
            <Text style={{ fontWeight: "bold" }}>Hotel: </Text>
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
            style={{ fontSize: 15, color: "#444", fontWeight: "600", flex: 1 }}
          >
            <Text style={{ fontWeight: "bold", color: "#2c3e50" }}>
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
            style={{ fontSize: 15, color: "#333", fontWeight: "600", flex: 1 }}
          >
            <Text style={{ fontWeight: "bold" }}>Check-In: </Text>
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
            style={{ fontSize: 15, color: "#333", fontWeight: "600", flex: 1 }}
          >
            <Text style={{ fontWeight: "bold" }}>Check-Out: </Text>
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
            style={{ fontSize: 15, color: "#333", fontWeight: "600", flex: 1 }}
          >
            <Text style={{ fontWeight: "bold" }}>Rooms: </Text>
            {numRooms}
          </Text>
        </View>

        {/* Price */}
        <View
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
              fontFamily: "Poppins-Medium",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "#333",
                fontFamily: "Poppins-Regular",
              }}
            >
              Total:{" "}
            </Text>
            Rs. {price}
          </Text>
        </View>
      </View>

      {/* Payment Button Section */}
      <TouchableOpacity
        style={{
          backgroundColor: "#fcb000",
          paddingVertical: 14,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          marginBottom: 30,
          elevation: 8,
        }}
        onPress={() => {
          handlePress();
          console.log("Proceeding to payment...");

          // Example: router.push('/PaymentConfirmation');
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "600",
            textTransform: "uppercase",
          }}
        >
          Proceed to Payment
        </Text>
      </TouchableOpacity>

      {/* Security Note Section */}

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
  );
};

export default PaymentScreen;
