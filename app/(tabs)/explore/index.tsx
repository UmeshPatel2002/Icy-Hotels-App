import { baseUrl } from "@/constants/server";
import {
  setCheckInDate,
  setCheckOutDate,
  setHotels,
  setSelectedHotel,
} from "@/redux/reducers/hotelSlice";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { Ionicons } from "@expo/vector-icons";

const ExploreScreen = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { city } = useLocalSearchParams();
  // console.log(city)
  const hotels = useSelector((state: any) => state.hotel.hotels);
  const searchLoader = useSelector((state: any) => state.hotel.searchLoader);
  const [query, setQuery] = useState("");
  // console.log("loader", searchLoader, city)
  useEffect(() => {
    if (city && typeof city === "string") {
      setQuery(city);
      fetchHotels();
    }
  }, [city]);

  const fetchHotels = async () => {
    setLoading(true);
    const selectedCity = city;
    try {
      const res = await axios.get(`${baseUrl}/hotels/all-hotels`, {
        params: { query: selectedCity },
      });
      if (res.status === 200) {
        dispatch(setHotels(res.data));
        setLoading(false);
      }
    } catch (error) {
      dispatch(setHotels([]));
      setLoading(false);

      console.error("Error fetching hotels by city:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelsSearch = async () => {
    // dispatch(setSearchLoader(true));
    setLoading(true);

    console.log("explore fteching");
    try {
      const res = await axios.get(`${baseUrl}/hotels/all-hotels`, {
        params: { query: query },
      });
      if (res.status === 200) {
        dispatch(setHotels(res.data));
        setLoading(false);
      }
    } catch (error) {
      dispatch(setHotels([]));
      setLoading(false);

      console.error("Error fetching hotels without:", error);
    } finally {
      setLoading(false);
    }
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
  // Render individual hotel cards with added details such as room type, category, and ratings
  const renderHotelCard = ({ item }: any) => {
    // console.log(item[1].price, "price");
    return (
      <TouchableOpacity
        key={item[0]._id}
        onPress={() => {
          dispatch(setSelectedHotel(item));
          const today = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1); // Add one day to today's date

          // Format the date as YYYY-MM-DD using local date methods
          const todayString = `${today.getFullYear()}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
          const tomorrowString = `${tomorrow.getFullYear()}-${(
            tomorrow.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${tomorrow
            .getDate()
            .toString()
            .padStart(2, "0")}`;

          console.log("today:", todayString, "tomorrow:", tomorrowString);

          dispatch(setCheckInDate(todayString));
          dispatch(setCheckOutDate(tomorrowString));
          router.push("/(tabs)/explore/booking/hotelDescription");
        }}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          marginBottom: 16,
          overflow: "hidden",
          shadowColor: "#bdbdbd",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 6,
          elevation: 6,
          flexDirection: "row",
          marginHorizontal: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FastImage
          source={{ uri: item[0]?.images[0] }}
          style={{
            width: 130,
            height: "100%",
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,

            marginRight: 12,
          }}
          resizeMode={FastImage.resizeMode.cover} // Correct usage of resizeMode
        />

        <View style={{ padding: 16, flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 6,
              color: "#333",
            }}
          >
            {item[0]?.name}
          </Text>
          <Text style={{ fontSize: 12, color: "#777", marginBottom: 6 }}>
            {item[0]?.hotelAddress?.substring(0, 36)}, {item[0]?.hotelCity}
          </Text>

          {/* Rating Display */}
          {item[0]?.ratings?.totalRating > 0 &&
          item[0]?.ratings?.totalUsers > 0 ? (
            <View style={{ flexDirection: "row", marginBottom: 4 }}>
              {renderStars(
                item[0]?.ratings?.totalRating > 0 &&
                  item[0]?.ratings?.totalUsers > 0
                  ? item[0]?.ratings?.totalRating / item[0]?.ratings?.totalUsers
                  : 0
              )}
            </View>
          ) : null}

          {/* Price */}
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Nunito-Regular",
              color: "#ff8c00",
              marginTop: 8,
            }}
          >
            Starts from :
            <Text style={{ color: "#6EB057", fontFamily: "Nunito-SemiBold" }}>
              {" "}
              ₹{item[1]?.price}/night
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        marginTop: StatusBar.currentHeight || 24,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ marginBottom: 10, padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>
            Explore Hotels
          </Text>
        </View>

        {/* Search Bar */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 16,
            marginHorizontal: 16,
            paddingVertical: 10,

            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000000",
            shadowOpacity: 0.5,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 6,
            elevation: 10,
          }}
        >
          <TextInput
            placeholder="Search hotels..."
            style={{ fontSize: 16, color: "#555", flex: 1 }}
            onChangeText={(val) => setQuery(val)} 
            value={query}
            onSubmitEditing={fetchHotelsSearch}
          />
          <TouchableOpacity onPress={fetchHotelsSearch}>
            <Ionicons name="search" size={24} color="#555" />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 12, paddingHorizontal: 16 }}>
          <Text
            style={{
              fontSize: 14,
              color: "#ff8c00",
              fontFamily: "Nunito-Regular",
            }}
          >
            {query ? `Showing results for: ${query}` : "All Hotels"}
          </Text>
        </View>

        {/* Hotels */}
        <View style={{}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginVertical: 20,
              paddingHorizontal: 16,
            }}
          >
            Hotels
          </Text>
          {loading || searchLoader ? (
            <ActivityIndicator size="large" color="#ff8c00" />
          ) : hotels?.length > 0 ? (
            <FlatList
              data={hotels}
              renderItem={renderHotelCard}
              keyExtractor={(item) => item[0]?._id}
            />
          ) : (
            <Text
              style={{ fontSize: 16, color: "#555", paddingHorizontal: 16 }}
            >
              No hotels found for your search.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;
