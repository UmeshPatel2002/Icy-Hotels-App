import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import { baseUrl } from "@/constants/server";
import { setSelectedHotel } from "@/redux/reducers/hotelSlice";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const RatingAndReviews = ({
  visible,
  onClose,
  hotel,
  userId,
  setAllReviews,
  isEditmode,
  existingReview
}: any) => {
  const [rating, setRating] = useState<number>(existingReview?.rating || 0);
  const [feedback, setFeedback] = useState(existingReview?.feedback || "");
  const dispatch = useDispatch();

 useEffect(() => {
      if (isEditmode) {
        setRating(existingReview.rating);
        setFeedback(existingReview.feedback);
      }
    }, [existingReview, isEditmode]);


  const handleSubmit = async () => {
    if (!rating || !feedback) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/rating/post-rating`, {
        userId,
        hotelId: hotel[0]?._id,
        rating,
        feedback,
      });

      //   console.log("Response:", response); // Log response from API
      setAllReviews((review: any) => ({
        ...review, // Spread the existing state
        userRating: response.data, // Correct assignment of userRating
      }));

      //   console.log(hotel);

      alert("Review submitted successfully!");
      // Calculate the updated hotel data
      const updatedHotel = hotel.map((item: any, index: any) =>
        index === 0
          ? {
              ...item,
              ratings: {
                ...item.ratings,
                totalRating: (item.ratings?.totalRating || 0) + rating,
                totalUsers: (item.ratings?.totalUsers || 0) + 1,
              },
            }
          : item
      );

      // Dispatch the updated hotel state
      dispatch(setSelectedHotel(updatedHotel));

      // console.log("after updating",hotel);

      onClose();
      setRating(0);
      setFeedback("");
    } catch (error) {
      console.error("Error submitting review:", error); // Log detailed error
      alert("Failed to submit review");
    }
  };

  // Function to handle star selection
  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
              alignItems: "center",
              // paddingBottom: 12,
              gap: 10,
            }}
          >
            {/* Feedback Title */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#333",
                marginLeft: 10,
              }}
            >
              {isEditmode ? "Edit Your Review":" Give Your Feedback"}
            </Text>

            {/* Close Button  */}
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: "#ffb000",
                paddingHorizontal: 2,
                paddingVertical: 2,
                borderRadius: 50,
                marginRight: 6,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Star Rating System */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
              >
                <Text
                  style={{
                    fontSize: 30,
                    marginHorizontal: 5,
                    color: star <= rating ? "#FFD700" : "#ccc",
                  }}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 10,
              marginVertical: 5,
              height: 100,
              fontSize: 16,
              color: "#777",
              textAlignVertical: "top",
            }}
            placeholder="Write your feedback..."
            multiline
            value={feedback}
            onChangeText={setFeedback}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#ffb000",
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              marginTop: 12,
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
            }}
            onPress={handleSubmit}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>{isEditmode ? "Update Review" : "Submit"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RatingAndReviews;
