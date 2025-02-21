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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importing Expo icons
import { baseUrl } from "@/constants/server";
import { useSelector } from "react-redux";
import axios from "axios";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RazorpayCheckout from "react-native-razorpay";

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
  const [loading, setLoading] = useState(false);
  // const [isAvailable, setIsAvailable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPayatHotel, setIsPayatHotel] = useState(false);


const checkInDateStr: string = Array.isArray(checkInDate) ? checkInDate[0] : checkInDate;
const checkOutDateStr: string = Array.isArray(checkOutDate) ? checkOutDate[0] : checkOutDate;
const checkIn: Date = new Date(checkInDateStr);
const checkOut: Date = new Date(checkOutDateStr);
if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
  throw new Error("Invalid date format");
}
const diffTime: number = checkOut.getTime() - checkIn.getTime();
const numNights: number = diffTime / (1000 * 60 * 60 * 24);
const totalNights: number = Math.max(numNights, 1);

  const handlePress = async (type: any) => {
    if (!user?._id) {
      setShowLoginModal(true);
    } else {
      await confirmBooking(type);
    }
  };

  const PayNow = async () => {
    const username = "rzp_test_pBMTJaj34QXvtD";
    const password = "66b51ryqjqhytnLET6iEbqUC";
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);
    const payamount = (Number(price) ?? 0)*totalNights * 0.95 * 100;
    console.log(
      "8**********",
      username,
      password,
      credentials,
      encodedCredentials,
      payamount
    );

    try {
      const response = await axios.post(
        "https://api.razorpay.com/v1/orders",
        {
          amount: payamount,
          currency: "INR",
          receipt: "userDetails._id",
          notes: {
            notes_key_1: "Welcome to Icy Hotels",
            notes_key_2: "Eat-Sleep-Code-Repeat.",
          },
        },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            "Content-Type": "application/json",
          },
        }
      );

      const order = response.data;
      console.log("******** order", order);
      var options = {
        description: "Payment for ICY Hotels",
        image:
          "https://res.cloudinary.com/dojp57ix9/image/upload/v1739643319/Screenshot_2025-02-15_233148_m9xwgg.png",
        currency: "INR",
        key: "rzp_test_pBMTJaj34QXvtD",
        amount: payamount, // Amount in paise (20000 paise = 200 INR)
        name: "ICY Hotels",
        order_id: order.id, // Use the order ID created using Orders API.
        prefill: {
          email: "vivek@gmail.com",
          contact: "7055029251",
          name: "Vivek Panwar",
        },
        theme: { color: "#ffb000" },
      };

      console.log("******* options", options);

      // await RazorpayCheckout.open(options)
      //   .then((data: any) => {
      //     // handle success
      //     // Alert.alert(Success: ${data.razorpay_payment_id});

      //     console.log("Payment Successful",data);
      //     // console.log("id",data.razorpay_payment_id);
      //     return data.razorpay_payment_id;
      //   })
      //   .catch((error: any) => {
      //     // handle failure
      //     // Alert.alert(Error: ${error.code} | ${error.description});
      //     console.error(error);
      //     setLoading(false);
      //     setIsPayNow(false);
      //     setIsPayatHotel(false);
      //     return null;
      //   });
      try {
        const data = await RazorpayCheckout.open(options);
        console.log("Payment Successful", data);
        if (!data || !data.razorpay_payment_id) {
          throw new Error(
            "No transaction ID received, payment was not completed."
          );
        }
        return data.razorpay_payment_id;
      } catch (error) {
        console.error(error);
        setLoading(false);
        setIsPayNow(false);
        setIsPayatHotel(false);
        return null;
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      setLoading(false);
      setIsPayNow(false);
      setIsPayatHotel(false);
      return null;
      // Alert.alert("Order creation failed", error.message);
    }
  };
  const handleCheckAvailability = async () => {
    try {
      const res = await axios.get(`${baseUrl}/hotels/confirm-availability`, {
        params: {
          hotelId,
          roomType,
          startDate: checkInDate,
          endDate: checkOutDate,
          roomsReq: numRooms,
        },
      });

      if (res.status === 200 && res.data) {
        return true;
      } else {
        setShowModal(true);
        return false;
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setLoading(false);
      setShowModal(true);
      return false;
    } finally {
      // setLoading(false);
    }
  };

  const showPopup = () => {
    setIsVisible(true);
    const timeout = setTimeout(() => {
      setIsVisible(false);
      router.back();
    }, 3000);
    return () => clearTimeout(timeout);
  };

  const confirmBooking = async (type: any) => {
    setLoading(true);
    const availability = await handleCheckAvailability();
    if (!availability) {
      console.log("Room not available");
      setIsPayNow(false);
      setLoading(false);
      setIsPayatHotel(false);
      return;
    }

    let transactionId = "";

    if (type === "online") {
      transactionId = await PayNow();
      console.log("Payment Transaction ID:", transactionId);

      if (!transactionId) {
        setIsPayNow(false);
        setLoading(false);
        setIsPayatHotel(false);
        return;
      }
    }

    console.log("booking");
    try {
      const res = await axios.post(`${baseUrl}/booking/book-room`, {
        user: user?._id,
        room: hotelId,
        checkInDate,
        checkOutDate,
        totalRooms: numRooms,
        status: "Confirmed",
        paymentStatus: type === "online" ? "Paid" : "Pending",
        transactionId: type === "online" ? transactionId : "XYZ",
        totalPrice:
          type === "online" ? ((Number(price) ?? 0)*totalNights* 0.95).toFixed(2) : price,
      });

      if (res.data) {
        setIsPayNow(false);
        setIsPayatHotel(false);
        setIsSuccess(true);
        showPopup();
      } else {
        setIsPayNow(false);
        setIsPayatHotel(false);
        setIsSuccess(false);
        showPopup();
      }
    } catch (error) {
      console.error("Error booking hotel:", error);
      setIsPayNow(false);
      setIsPayatHotel(false);
      setIsSuccess(false);
      showPopup();
    } finally {
      setLoading(false);
      setIsPayNow(false);
      setIsPayatHotel(false);
    }
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
                  source={require("../../../../assets/lottie/success.json")}
                  autoPlay
                  loop={false}
                  style={{ width: width, height: height }} // Adjust size
                />
              )}
              {isSuccess === false && (
                <LottieView
                  source={require("../../../../assets/lottie/failure.json")}
                  autoPlay
                  loop={false}
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
            {/* Pay at Hotel Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#FFF6DC",
                paddingHorizontal: 10,
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
                width: 140,
                height: 70,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={async () => {
                setIsPayatHotel(true);
                await handlePress("payAtHotel");
              }}
              disabled={loading}
            >
              {isPayatHotel && user ? (
                <ActivityIndicator size={36} color="#fbb000" />
              ) : (
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
                    ₹{(Number(price)*totalNights).toFixed(2)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Pay Now Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#e8fceb",
                paddingHorizontal: 10,
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
                width: 140,
                height: 70,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={async () => {
                setIsPayNow(true);
                await handlePress("online");
                // console.log("Proceeding to payment...");
              }}
              disabled={loading}
              activeOpacity={0.7}
            >
              {isPayNow && user ? (
                <ActivityIndicator color="green" size={36} />
              ) : (
                <View style={{ alignItems: "center" }}>
                  {/* Pay Now Text */}
                  <Text
                    style={{
                      color: "green",
                      fontSize: 14,
                      fontFamily: "Nunito-SemiBold",
                      textTransform: "uppercase",
                      marginBottom: 4, // Instead of "gap"
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
                      ₹{Number(price)*totalNights}
                    </Text>

                    {/* Discounted Price */}
                    <Text
                      style={{
                        color: "green",
                        fontSize: 16,
                        fontFamily: "Nunito-Bold",
                      }}
                    >
                      ₹{(Number(price)*totalNights * 0.95).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
