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
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const { width } = Dimensions.get("window");


const HotelCard = ({ hotel, setModalVisible }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(newIndex);
  };

  const handleBookNow = () => {
    setModalVisible(true);
  };

  return (
    <View
      key={hotel?._id}
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
          {hotel?.hotelId?.images &&
            hotel?.hotelId?.images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{
                  width: width - 20,
                  height: 220,
                  resizeMode: "cover",
                }}
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
          {hotel?.hotelId?.images?.map((_, index) => (
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
          {hotel?.hotelId?.name}
        </Text>
        {/* Hotel Description */}
        <Text
          style={{
            fontSize: 14,
            color: "#555",
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {hotel?.hotelId?.description}
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
            {hotel?.hotelId?.hotelAddress}
          </Text>
        </View>

        {/* Room Type Section */}
        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginRight: 8,
                color: "#333",
              }}
            >
              Room Type:
            </Text>
            <Text
              style={{
                backgroundColor: "#ffecd0",
                color: "#ffb000",
                fontWeight: "bold",
                fontSize: 14,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 12,
              }}
            >
              {hotel?.roomType}
            </Text>
          </View>
        </View>

        {/* Highlighted Info */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
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
              Rs.{hotel?.price}/night
            </Text>
          </View>
          
          <View
            style={{
              backgroundColor: "#ffecd0",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 14, color: "#ffb000" }}>
              {hotel?.distance || 0} km away
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#ffecd0",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 14, color: "#ffb000" }}>
              Rating: {hotel?.hotelId?.ratings?.totalRating} ⭐
            </Text>
          </View>
         
        </View>

        {/* Amenities Section */}
        <View style={{ marginBottom: 15 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 6,
              color: "#333",
            }}
          >
            Amenities:
          </Text>
          <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
            {hotel?.hotelId?.hotelAmenities?.map((amenity, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#fdf6e3",
                  borderColor: "#ffb000",
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  margin: 5,
                }}
              >
                <Text style={{ fontSize: 12, color: "#333" }}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Map Section */}

        {/* Book Now Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#ffb000",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => {
            handleBookNow();
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
    </View>
  );
};

export default function Hotels() {
  const { location } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const hotels = useSelector((state: any) => state.hotel.searchedHotels);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const confirmBooking = () => {
    setModalVisible(false);
    console.log("Booking Confirmed!");
  };

  const searchHotels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/hotels/hotels-by-city`, {
        params: {
          qs: location,

        },
      });

      const searchedHotels = res.data;
      dispatch(setSearchedHotels(searchedHotels));
      console.log(searchedHotels);
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
    <></>
    // <SafeAreaView
    //   style={{
    //     flex: 1,
    //     backgroundColor: "#f7f7f7",
    //     paddingHorizontal: 10,
    //   }}
    // >
    //   {/* Loader */}
    //   {loading ? (
    //     <View
    //       style={{
    //         flex: 1,
    //         justifyContent: "center",
    //         alignItems: "center",
    //         height: "100%",
    //       }}
    //     >
    //       <ActivityIndicator size="large" color="#ffb000" />
    //       <Text style={{ marginTop: 10, fontSize: 16, color: "#777" }}>
    //         Loading Hotels...
    //       </Text>
    //     </View>
    //   ) : (
    //     // Hotel Cards List
    //     <View
    //       style={{
    //          marginTop:10,

    //       }}
    //     >
    //       <Text style={{ fontSize: 20, fontFamily:poppins-black, marginBottom: 15,paddingHorizontal:5 }}>
    //        Available Hotels 
    //       </Text>
        
    //     <FlatList
    //       data={hotels}
    //       keyExtractor={(item) => item._id}
    //       renderItem={({ item }) => (
    //         <View
    //           style={{
    //             marginBottom: 20, // Space between hotel cards
    //             borderRadius: 15,
    //             overflow: "hidden",
    //             backgroundColor: "#fff",
    //           }}
    //         >
    //           <HotelCard
    //             key={item._id}
    //             hotel={item}
    //             setModalVisible={setModalVisible}
    //           />
    //         </View>
    //       )}
    //       showsVerticalScrollIndicator={false}
    //       ListEmptyComponent={
    //         <Text style={{ textAlign: "center", marginTop: 20 }}>
    //           No hotels available
    //         </Text>
    //       }
    //     />
    //     </View>
    //   )}

    //   <Modal
    //     animationType="slide"
    //     transparent={true}
    //     visible={modalVisible}
    //     onRequestClose={closeModal}
    //   >
    //     <View
    //       style={{
    //         flex: 1,
    //         justifyContent: "center",
    //         alignItems: "center",
    //         backgroundColor: "rgba(0, 0, 0, 0.6)",
    //       }}
    //     >
    //       <View
    //         style={{
    //           width: width * 0.8,
    //           backgroundColor: "#fff",
    //           borderRadius: 20,
    //           padding: 20,
    //           elevation: 5,
    //           shadowColor: "#000",
    //           shadowOffset: { width: 0, height: 4 },
    //           shadowOpacity: 0.25,
    //           shadowRadius: 8,
    //           alignItems: "center",
    //         }}
    //       >
    //         <Text
    //           style={{
    //             fontSize: 20,
    //             fontWeight: "bold",
    //             color: "#333",
    //             marginBottom: 15,
    //           }}
    //         >
    //           Confirm Booking
    //         </Text>
    //         <Text
    //           style={{
    //             fontSize: 16,
    //             color: "#555",
    //             textAlign: "center",
    //             marginBottom: 20,
    //           }}
    //         >
    //           Are you sure you want to book this room?
    //         </Text>

    //         {/* Action Buttons */}
    //         <View
    //           style={{
    //             flexDirection: "row",
    //             justifyContent: "space-between",
    //             width: "100%",
    //           }}
    //         >
    //           <TouchableOpacity
    //             style={{
    //               flex: 1,
    //               paddingVertical: 12,
    //               borderRadius: 30,
    //               marginHorizontal: 10,
    //               backgroundColor: "#ffb000",
    //               alignItems: "center",
    //             }}
    //             onPress={confirmBooking}
    //           >
    //             <Text
    //               style={{
    //                 fontSize: 16,
    //                 fontWeight: "bold",
    //                 color: "#fff",
    //               }}
    //             >
    //               Yes, Confirm
    //             </Text>
    //           </TouchableOpacity>
    //           <TouchableOpacity
    //             style={{
    //               flex: 1,
    //               paddingVertical: 12,
    //               borderRadius: 30,
    //               marginHorizontal: 10,
    //               backgroundColor: "#ccc",
    //               alignItems: "center",
    //             }}
    //             onPress={closeModal}
    //           >
    //             <Text
    //               style={{
    //                 fontSize: 16,
    //                 fontWeight: "bold",
    //                 color: "#fff",
    //               }}
    //             >
    //               Cancel
    //             </Text>
    //           </TouchableOpacity>
    //         </View>
    //       </View>
    //     </View>
    //   </Modal>
    // </SafeAreaView>
  );
}
