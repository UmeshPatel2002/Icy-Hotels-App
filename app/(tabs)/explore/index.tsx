import { baseUrl } from "@/constants/server";
import { setHotels, setSelectedHotel } from "@/redux/reducers/hotelSlice";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image"
import { Ionicons } from "@expo/vector-icons";


// const categories = [
//   { id: "1", name: "Luxury", icon: "🌟" },
//   { id: "2", name: "Budget", icon: "💸" },
//   { id: "3", name: "Family", icon: "👨‍👩‍👧‍👦" },
//   { id: "4", name: "Romantic", icon: "❤️" },
// ];

const ExploreScreen = () => {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const { city } = useLocalSearchParams();
  // console.log(city)
  const hasFetched = useRef(false);
  const hotels = useSelector((state: any) => state.hotel.hotels)
  const searchLoader = useSelector((state: any) => state.hotel.searchLoader)
  const [query, setQuery] = useState("");
  // console.log("loader", searchLoader, city)
  useEffect(() => {
    if (city) {
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
      dispatch(setHotels([]))
      setLoading(false);

      console.error("Error fetching hotels by city:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchHotelsSearch = async () => {
    // dispatch(setSearchLoader(true));
    setLoading(true);

    console.log("explore fteching")
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



  // Render individual hotel cards with added details such as room type, category, and ratings
  const renderHotelCard = ({ item }: any) => {


    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(setSelectedHotel(item));
          router.push("/(tabs)/explore/booking/hotelDescription")
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
          source={{ uri: item?.hotelId?.images[0] }}
          style={{
            width: 130,
            height: "100%",
            borderRadius: 12,
            marginRight: 12,
            borderWidth: 1,
            borderColor: "#727070",
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
            {item?.hotelId?.name}
          </Text>
          <Text style={{ fontSize: 12, color: "#777", marginBottom: 6 }}>
            {item?.hotelId?.hotelAddress}, {item?.hotelId?.hotelCity}
          </Text>

          {/* Rating Display */}
          <View style={{ flexDirection: "row", marginBottom: 4 }}>

            <Text

              style={{
                color: "#ff8c00",
                fontSize: 12,
              }}
            >
              ★ {item?.hotelId?.ratings?.totalRating}
            </Text>


          </View>

          {/* Room Type & Category */}
          <Text
            style={{
              fontSize: 12,
              color: "#666",
              fontWeight: "500",
              marginBottom: 4,
            }}
          >
            Room Type: <Text style={{ fontWeight: "bold" }}>{item?.roomType}</Text>
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#666",
              fontWeight: "500",
              marginBottom: 4,
            }}
          >
            Category: <Text style={{ fontWeight: "bold" }}>{item?.hotelId?.category}</Text>
          </Text>

          {/* Price */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#ff8c00",
              marginTop: 8,
            }}
          >
            ₹{item?.price}/night
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
        marginTop: StatusBar.currentHeight || 24,
      }}
    >
      <ScrollView style={{ flex: 1 }}>
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
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <TextInput
            placeholder="Search hotels..."
            style={{ fontSize: 16, color: "#555", flex: 1 }}
            onChangeText={(val) => setQuery(val)} // Use onChangeText instead of onChange
            value={query}
            onSubmitEditing={fetchHotelsSearch}
          />
          <TouchableOpacity
            onPress={fetchHotelsSearch}
            >
              <Ionicons name="search" size={24} color="#555" />
            </TouchableOpacity>


        </View>
        <View style={{ marginTop:12, paddingHorizontal: 16, }}>
          <Text style={{ fontSize: 14, color: "#ff8c00",fontFamily:"Poppins-Regular" }}>
            {query ? `Showing results for: ${query}`  : "All Hotels"}
          </Text>
        </View>

      

        {/* Hotels */}
        <View style={{

        }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 20, paddingHorizontal: 16 }}>
            Hotels
          </Text>
          {(loading || searchLoader) ? (
            <ActivityIndicator size="large" color="#ff8c00" />
          ) : hotels?.length > 0 ? (
            <FlatList
              data={hotels}
              renderItem={renderHotelCard}
              keyExtractor={(item) => item._id}
            />
          ) : (
            <Text style={{ fontSize: 16, color: "#555", paddingHorizontal: 16 }}>
              No hotels found for your search.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;
