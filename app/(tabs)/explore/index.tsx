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



// const categories = [
//   { id: "1", name: "Luxury", icon: "🌟" },
//   { id: "2", name: "Budget", icon: "💸" },
//   { id: "3", name: "Family", icon: "👨‍👩‍👧‍👦" },
//   { id: "4", name: "Romantic", icon: "❤️" },
// ];

const ExploreScreen = () => {

const dispatch=useDispatch();
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router=useRouter();
 const {city}=useLocalSearchParams();
  console.log(city)
  const hasFetched = useRef(false);
const hotels=useSelector((state:any)=>state.hotel.hotels)
const searchLoader =useSelector((state:any)=>state.hotel.searchLoader)

  useEffect(() => {
  if(city){
    fetchHotels();
  }

  }, [city]);
  


  const fetchHotels = async () => {
    setLoading(true);
    const selectedCity = city ;
    try {
      const res = await axios.get(`${baseUrl}/hotels/hotels-by-city`, {
        params: { qs: selectedCity },
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

 

  // Render individual hotel cards with added details such as room type, category, and ratings
  const renderHotelCard = ({ item }:any) => {
    const { hotelId, price, roomType, _id } = item;
    const { name,hotelAddress, hotelCity, hotelState, images, ratings,category } = hotelId;
    const rating = ratings.totalRating || 0;
    const totalUsers = ratings.totalUsers || 0;

    return (
      <TouchableOpacity
      onPress={()=>{
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
          marginHorizontal:16,
          justifyContent:"center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: images[0] }}
          style={{
            width: 130,
            height:"100%",
            borderRadius: 12,
            marginRight: 12,
            borderWidth: 2,
            borderColor: "#ff8c00",
           
          }}
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
            {name}
          </Text>
          <Text style={{ fontSize: 12, color: "#777", marginBottom: 6 }}>
           {hotelAddress}, {hotelCity}
          </Text>

          {/* Rating Display */}
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            
              <Text
                
                style={{
                  color: "#ff8c00",
                  fontSize: 12,
                }}
              >
                ★ {rating}
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
            Room Type: <Text style={{ fontWeight: "bold" }}>{roomType}</Text>
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#666",
              fontWeight: "500",
              marginBottom: 4,
            }}
          >
            Category: <Text style={{ fontWeight: "bold" }}>{category}</Text>
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
            ₹{price}/night
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
        <View style={{ marginBottom: 20, padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>
            Explore Hotels
          </Text>
          <Text style={{ fontSize: 16, color: "#555" }}>
            {city ? `Showing results for ${city}` : "All Hotels"}
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
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 16, color: "#555", marginRight: 10 }}>🔍</Text>
          <TextInput
            placeholder="Search hotels, cities, or categories"
            style={{ fontSize: 16, color: "#555", flex: 1 }}
          />
        </View>

        {/* Categories */}
        {/* <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
            Categories
          </Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 25,
                  marginRight: 10,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 6,
                  elevation: 3,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, marginRight: 6 }}>{item.icon}</Text>
                <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View> */}

        {/* Hotels */}
        <View style={{
         
        }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 20 , paddingHorizontal: 16}}>
            Hotels
          </Text>
          {loading || searchLoader ? (
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
