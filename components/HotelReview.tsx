import React, { useState, useEffect } from "react";
import { View, Text, Pressable,FlatList } from "react-native";
import RatingAndReviews from "./RatingAndReviews";
import { baseUrl } from "@/constants/server";
import axios from "axios";

const HotelReviews = ({ hotel, userId}: any) => {
  const [showReviews, setShowReviews] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [allReviews, setAllReviews] = useState({ allRatings: [], userRating: null });
//   console.log('Hotel Data:', hotel);

  useEffect(() => {
    fetchRatings();
  }, [ userId]); 

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${baseUrl}/rating/get-hotel-ratings`, {
        params: {
          hotelId:hotel[0]?._id,
          userId,
        },
      });
      setAllReviews(res.data);



    } catch (error) {
      console.log(error, "Error getting ratings");
    }
  };
  const hasReviewed = allReviews?.userRating?.userId === userId;

//   console.log(allReviews,"All reviews");

  return (
    
    <View style={{ padding: 20 }}>
        <View>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={{ marginTop: 6 }}
            disabled={hasReviewed}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: hasReviewed ? "#ccc" : "#ffb000", 
              }}
            >
              {hasReviewed ?null: "Add Review"}
            </Text>
          </Pressable>
      </View>

      {userId && hasReviewed && allReviews?.userRating && (
        <View
          style={{
            padding: 12,
            backgroundColor: "#ffefd5",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ddd",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>Your Review</Text>
          <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 4 }}>
            {allReviews?.userRating?.rating} ⭐ 
          </Text>
          <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
            {allReviews?.userRating?.feedback}
          </Text>
          
        </View>
      )}


      {/* Reviews Section */}
      {allReviews?.allRatings.length>0 && (
        <FlatList
          data={allReviews?.allRatings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                backgroundColor: "#f7f7f7",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ddd",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
                User ID: {item.userId}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 4 }}>
                {item.rating} ⭐ 
              </Text>
              <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>{item.feedback}</Text>
              
            </View>
          )}
        />
      )}


      {/* Rating and Review Modal */}
      <RatingAndReviews
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        hotel={hotel}
        userId={userId}
        setAllReviews={setAllReviews}
      />
    </View>
  );
};

export default HotelReviews;
