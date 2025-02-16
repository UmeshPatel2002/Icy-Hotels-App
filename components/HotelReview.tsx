import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import RatingAndReviews from "./RatingAndReviews";
import { baseUrl } from "@/constants/server";
import axios from "axios";

const HotelReviews = ({ hotel, userId }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isReviewEditable, setIsReviewEditable] = useState(false);
  const [allReviews, setAllReviews] = useState<{ 
    allRatings: any[]; 
    userRating: any | null; 
  }>({
    allRatings: [], 
    userRating: {}
  });
  const [hasReviewed,setHasReviewed]=useState(false);
  
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

  const handleReviewUpdate = async (newReview: any) => {
    setAllReviews((prev) => ({
      ...prev,
      userRating: newReview,
    }));
    
    await fetchRatings(); // Ensure the UI gets the latest data
  };
  
  


  //   console.log(allReviews,"All reviews");
  useEffect(() => {
    console.log("Updated allReviews:", allReviews);

  setHasReviewed(allReviews?.userRating?.userId?._id === userId);

  }, [allReviews]);

  return (
    <View style={{ padding: 20 }}>
      {!hasReviewed && (
        <View
          style={{ marginTop: 10, alignItems: "center", paddingBottom: 10 }}
        >
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
                fontFamily: "Nunito-Semibold",
                color: hasReviewed ? "#888" : "#fff",
                textAlign: "center",
              }}
            >
              Add Review
            </Text>
          </Pressable>
        </View>
      )}

      {userId && allReviews?.userRating?.userId?._id === userId && (
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Nunito-SemiBold",
                color: "#333",
              }}
            >
              Your Review
            </Text>
            <Pressable
              onPress={() => {
                setIsReviewEditable(true);
                setModalVisible(true);
              }}
              style={{ justifyContent: "flex-end" }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Nunito-SemiBold",
                  color: "#ffb000",
                  textAlign: "center",
                }}
              >
                Edit
              </Text>
            </Pressable>
          </View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Nunito-SemiBold",
              marginTop: 4,
            }}
          >
            {allReviews?.userRating?.rating} ⭐
          </Text>

          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              letterSpacing: 0.25,
              fontFamily: "Nunito-Regular",
              color: "#666",
              marginTop: 4,
            }}
          >
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
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Image
                  source={{ uri: item?.userId?.userImage }}
                  style={{ width: 30, height: 30, borderRadius: 50,}}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Nunito-SemiBold",
                      color: "#333",
                    }}
                  >
                    {item?.userId?.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Nunito-SemiBold",
                      marginTop: 4,
                    }}
                  >
                    {item?.rating} ⭐
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 14,
                  color: "#666",
                  lineHeight: 20,
                  letterSpacing: 0.25,
                  fontFamily: "Nunito-Regular",
                  marginTop:6,
                }}
              >
                {item?.feedback}
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
        allReviews={allReviews}
        setAllReviews={handleReviewUpdate}
        isEditmode={isReviewEditable}
        existingReview={allReviews?.userRating}
      />
    </View>
  );
};

export default HotelReviews;
