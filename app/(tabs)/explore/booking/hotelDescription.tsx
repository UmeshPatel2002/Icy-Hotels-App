import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { baseUrl } from "@/constants/server";
import { formatDateRange } from "@/logics/logics";
import FastImage from "react-native-fast-image";
import HotelReviews from "@/components/HotelReview";

const HotelDescriptionScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const hotel = useSelector((state: any) => state?.hotel.selectedHotel);
  const router = useRouter();
  const imageHeight = 350;

  const [datesModal, setDatesModal] = useState(false);
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);
  const { width, height } = Dimensions.get("window");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null); // `null` for no check yet
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const checkInDate = useSelector((state: any) => state.hotel.checkInDate);
  const checkOutDate = useSelector((state: any) => state.hotel.checkOutDate);
  const user = useSelector((state: any) => state.user.userDetails);
  // console.log("explore desc", checkInDate, checkOutDate, user, hotel[0]?._id);
  const [isVisible, setIsVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [descCharLimit, setDescCharLimit] = useState(100); // Start with 100 characters
  const [locationCharLimit, setLocationCharLimit] = useState(100); // Start with 100 characters

  const roomType = Array.isArray(hotel) ? hotel.slice(1) : []; // Ensure hotel is an array, or use an empty array if not

  const [showLoginModal, setShowLoginModal] = useState(false);

  // const handlePress = () => {
  //   if (!user?._id) {
  //     setShowLoginModal(true); // Open modal
  //   } else {
  //     handleCheckAvailability(); // Proceed to book
  //   }
  // };

  const updateRooms = (newRooms: number) => {
    // console.log("newRooms", newRooms);
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

  const handleSelectRoom = (room: any) => {
    setSelectedRoomType(room.roomType);
    setSelectedPrice(room.price);
  };

  const renderStars = (rating: any) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <Text key={i} style={{ color: "#ffb000", fontSize: 18 }}>
            ★
          </Text>
        );
      } else if (i === Math.floor(rating) + 1 && rating % 1 >= 0.5) {
        stars.push(
          <Text key={i} style={{ color: "#ffb000", fontSize: 18 }}>
            ☆
          </Text>
        );
      } else {
        stars.push(
          <Text key={i} style={{ color: "#ccc", fontSize: 18 }}>
            ★
          </Text>
        );
      }
    }
    return stars;
  };

  const handleCheckAvailability = async () => {
    // console.log(hotel, checkInDate, checkOutDate);
    if (
      !hotel[0]?._id ||
      !selectedRoomType ||
      !checkInDate ||
      !checkOutDate ||
      !rooms
    ) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/hotels/confirm-availability`, {
        params: {
          hotelId: hotel[0]?._id,
          roomType: selectedRoomType,
          startDate: checkInDate,
          endDate: checkOutDate,
          roomsReq: rooms,
        },
      });
      // console.log(res.data);
      if (res.status === 200 && res.data) {
        // console.log(res.data);
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
    // console.log(
    //   "confirming booking",
    //   rooms,
    //   user?._id,
    //   hotel?._id,
    //   rooms* selectedPrice
    // );
    try {
      const res = await axios.post(`${baseUrl}/booking/book-room`, {
        user: user?._id,
        room: hotel[0]?._id,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        totalRooms: rooms,
        status: "Confirmed",
        paymentStatus: "Paid",
        transactionId: "xyz",
        totalPrice: rooms * selectedPrice,
      });

      if (res.data) {
        // console.log(res.data);
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
  };

  const getLimitedText = (text: any, charLimit: any) => {
    return text.length > charLimit ? text.slice(0, charLimit) + "..." : text;
  };

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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
              {hotel[0]?.images &&
                hotel[0]?.images?.map((img: any, index: any) => (
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
              // elevation: 5,
              // shadowColor: "#000",
              // shadowOffset: { width: 0, height: 2 },
              // shadowOpacity: 0.1,
              // shadowRadius: 8,
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
              {hotel[0]?.name}
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
              {hotel[0]?.category}
            </Text>

            {/* Hotel Address */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <MaterialIcons name="location-on" size={24} color="#ffb000" />
              <View>
              <Text
                style={{
                  fontSize: 14,
                  color: "#555",
                  marginLeft: 8,
                }}
              >
                {getLimitedText(hotel[0].hotelAddress, locationCharLimit)}
              </Text>
              {hotel[0].hotelAddress.length > locationCharLimit ? (
                <TouchableOpacity
                  onPress={() => setLocationCharLimit(locationCharLimit + 100)}
                >
                  <Text
                    style={{
                      color: "#ffb000",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    Show More
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setLocationCharLimit(100)}>
                  <Text
                    style={{
                      color: "#ffb000",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {hotel[0]?.hotelAddress.length>100?<Text>Show Less</Text>:null}
                    
                  </Text>
                </TouchableOpacity>
              )}
              </View>
              
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
              {hotel[0]?.description}
            </Text>

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
                {hotel[0]?.hotelAmenities &&
                  hotel[0]?.hotelAmenities?.map((amenity: any, index: any) => (
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

            {/* Room Types*/}

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
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 10,
                  color: "#333",
                }}
              >
                Select Room
              </Text>

              <FlatList
                data={roomType}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 2 }}
                renderItem={({ item }) => {
                  const isSelected = selectedRoomType === item.roomType;

                  return (
                    <TouchableOpacity
                      onPress={() => handleSelectRoom(item)}
                      style={{
                        backgroundColor: isSelected ? "#ffdb99" : "#f5f5f5",
                        padding: 10,
                        borderRadius: 10,
                        marginHorizontal: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: isSelected ? 2 : 0,
                        borderColor: isSelected ? "#ff9800" : "transparent",
                        shadowColor: "#999",
                        shadowOpacity: isSelected ? 0.3 : 0.1,
                        shadowRadius: 5,
                        elevation: isSelected ? 6 : 3,
                        minWidth: 150,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#333",
                          flex: 1,
                        }}
                      >
                        {item.roomType}
                      </Text>
                      <View
                        style={{
                          backgroundColor: "#6EB057",
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "#fff",
                          }}
                        >
                          ₹{item.price}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
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
                    textAlign: "center",
                  }}
                >
                  Select Dates & Room
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 12,
                    paddingHorizontal: 5,
                    textAlign: "center",
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
                    {checkInDate && checkOutDate
                      ? formatDateRange(checkInDate, checkOutDate)
                      : "Jan 1 - Jan 2"}
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
                  marginTop: 10,
                }}
                onPress={() => {
                  // handlePress();
                  handleCheckAvailability();
                }}
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

          {/* Ratings */}
          <View
            style={{
              margin: 15,
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#ffb000",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {/* Rating Section */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc",
                  paddingBottom: 4,
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 8,
                    color: "#333",
                  }}
                >
                  Ratings & Reviews:
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {renderStars(
                    hotel[0]?.ratings?.totalRating > 0 &&
                      hotel[0]?.ratings?.totalUsers > 0
                      ? hotel[0]?.ratings?.totalRating /
                          hotel[0]?.ratings?.totalUsers
                      : 0
                  )}
                  <Text style={{ fontSize: 16, color: "#777", marginLeft: 8 }}>
                    ({hotel[0]?.ratings?.totalUsers || 0} reviews)
                  </Text>
                </View>
              </View>
            </View>

            <HotelReviews hotel={hotel} userId={user?._id} />
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
                  backgroundColor: "#fbc000",
                  paddingVertical: 15,
                  paddingHorizontal: 30,
                  borderRadius: 30,
                  alignItems: "center",
                  marginTop: 10,
                }}
                onPress={() => {
                  closeModal();
                  router.navigate({
                    pathname: "/(tabs)/explore/booking/bookingPayment", // Ensure your PaymentScreen is placed in the `/app` directory
                    params: {
                      hotelId: hotel[0]._id,
                      hotelName: hotel[0].name,
                      hotelImg: hotel[0].images[0],
                      roomType: selectedRoomType,
                      checkInDate,
                      checkOutDate,
                      numRooms: rooms,
                      price: selectedPrice * rooms,
                    },
                  });
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
        onRequestClose={() => setDatesModal(false)}
        onDismiss={() => setDatesModal(false)}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            shadowColor: "#000",
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <View
            style={{
              width: width,
              height: height * 0.5,
              position: "absolute",
              bottom: 0,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 0,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins-SemiBold",
                  marginBottom: 20,
                }}
              >
                Select Room & Guests
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setDatesModal(false);
                }}
              >
                <Entypo name="cross" size={28} color="black" />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  marginRight: 10,
                  fontFamily: "Poppins-Regular",
                }}
              >
                Number of Guests:
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => updateGuests(guests - 1 < 1 ? 1 : guests - 1)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="#ffb000"
                  />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, marginHorizontal: 10 }}>
                  {guests}
                </Text>
                <TouchableOpacity onPress={() => updateGuests(guests + 1)}>
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#ffb000"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontSize: 14,
                  marginRight: 10,
                  fontFamily: "Poppins-Regular",
                }}
              >
                Number of Rooms:
              </Text>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <TouchableOpacity
                  onPress={() => updateRooms(rooms - 1 < 1 ? 1 : rooms - 1)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="#ffb000"
                  />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, marginHorizontal: 10 }}>
                  {rooms}
                </Text>
                <TouchableOpacity onPress={() => updateRooms(rooms + 1)}>
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#ffb000"
                  />
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
    </View>
  );
};

export default HotelDescriptionScreen;
