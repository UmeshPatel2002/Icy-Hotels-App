import React, { useState, useEffect } from "react";
import { View, Text, Pressable, FlatList, TouchableOpacity } from "react-native";
import RatingAndReviews from "./RatingAndReviews";
import { baseUrl } from "@/constants/server";
import axios from "axios";

const HotelReviews = ({ hotel, userId }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isReviewEditable, setIsReviewEditable]=useState(false);
  const [allReviews, setAllReviews] = useState({
    allRatings: [],
    userRating: null,
  });
  //   console.log('Hotel Data:', hotel);

  useEffect(() => {
    fetchRatings();
  }, [userId]);

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${baseUrl}/rating/get-hotel-ratings`, {
        params: {
          hotelId: hotel[0]?._id,
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
      {!hasReviewed && (
        <View style={{ marginTop: 10, alignItems: "center", paddingBottom:10  }}>
          <Pressable
            onPress={() => setModalVisible(true)}
            disabled={hasReviewed}
            style={({ pressed }) => [
              {
                backgroundColor: hasReviewed ? "#ccc" : "#ffb000",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                opacity: pressed ? 0.7 : 1, // Adds feedback on press
              },
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily:"Nunito-Semibold",
                color: hasReviewed ? "#888" : "#fff",
                textAlign: "center",
              }}
            >
              Add Review
            </Text>
          </Pressable>
        </View>
      )}

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
          <View style={{flexDirection:"row", justifyContent:"space-between"}}>
            <Text style={{ fontSize: 16, fontFamily:"Nunito-SemiBold", color: "#333" }}>
              Your Review
            </Text>
             <Pressable 
             onPress={() => {
              setIsReviewEditable(true);
              setModalVisible(true);
            }}
             style={{justifyContent:"flex-end"}}
             >
              <Text style={{
                fontSize: 14,
                fontFamily:"Nunito-SemiBold",
                color:"#ffb000",
                textAlign: "center",
              }}>Edit</Text>
             </Pressable>
          </View>
          <Text style={{ fontSize: 14, fontFamily:"Nunito-SemiBold", marginTop: 4 }}>
            {allReviews?.userRating?.rating} ⭐
          </Text>

          <Text style={{ fontSize: 14,lineHeight:20,letterSpacing:0.25, fontFamily:"Nunito-Regular", color: "#666", marginTop: 4 }}>
            {allReviews?.userRating?.feedback}
          </Text>
        </View>
      )}

      {/* Reviews Section */}
      {allReviews?.allRatings.length > 0 && (
        <FlatList
          data={allReviews?.allRatings}
          keyExtractor={(item: any) => item._id}
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
              <Text style={{ fontSize: 14, fontFamily:"Nunito-SemiBold", color: "#333" }}>
                User ID: {item.userId}
              </Text>
              <Text style={{ fontSize: 14, fontFamily:"Nunito-SemiBold", marginTop: 4 }}>
                {item.rating} ⭐
              </Text>
              <Text style={{ fontSize: 14, color: "#666",lineHeight:20,letterSpacing:0.25,fontFamily:"Nunito-Regular", marginTop: 4 }}>
                {item.feedback}
              </Text>
            </View>
          )}
        />
      )}

      {/* Rating and Review Modal */}
      <RatingAndReviews
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setIsReviewEditable(false);
        }}
        hotel={hotel}
        userId={userId}
        setAllReviews={setAllReviews}
        isEditmode={isReviewEditable}
        existingReview={allReviews?.userRating}
      />
    </View>
  );
};

export default HotelReviews;
