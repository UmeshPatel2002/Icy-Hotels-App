import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "@/constants/server";
import { Ionicons } from "@expo/vector-icons";

const HistoryScreen = () => {
  const [activeTab, setActiveTab] = useState<"Current" | "Past">("Current");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: any) => state.user.userDetails);

  const fetchCurrentBookings = async () => {
    try {
      const response = await axios.get(`${baseUrl}/booking/upcoming-bookings`, {
        params: { userId: user?._id },
      });
      if (response.data) {
        // console.log(response.data);
        setBookings(response?.data?.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPastBookings = async () => {
    // console.log("past bookings fetching")
    try {
      const response = await axios.get(`${baseUrl}/booking/booking-history`, {
        params: { userId: user?._id },
      });
      if (response.data) {
        // console.log(response.data);
        setBookings(response?.data?.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(activeTab==="Current") fetchCurrentBookings();
    else fetchPastBookings();
  }, [activeTab]);

 



const renderBooking = ({ item }: { item: any }) => (
  <View
    style={{
      backgroundColor: "#f9fafb",
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
      margin: 20, 
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 6,
      borderWidth: 1,
      borderColor: "#e5e7eb",
    }}
  >
    {/* Header with Icon */}
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <Ionicons
        name="bed"
        size={28}
        color="#6366f1"
        style={{ marginRight: 10 }}
      />
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          {item?.room?.roomType}
        </Text>
        <Text style={{ fontSize: 12, color: "#9ca3af" }}>
          Booking ID: {item?._id}
        </Text>
      </View>
    </View>

    {/* Divider */}
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        marginVertical: 10,
      }}
    ></View>

    {/* Booking Details */}
    <View style={{ marginBottom: 12 }}>
      <DetailRow
        label="Hotel ID"
        value={item?.room?.hotelId}
        icon="business"
        iconColor="#10b981"
      />
      <DetailRow
        label="Check-In"
        value={new Date(item?.checkInDate).toLocaleDateString()}
        icon="calendar"
        iconColor="#3b82f6"
      />
      <DetailRow
        label="Check-Out"
        value={new Date(item?.checkOutDate).toLocaleDateString()}
        icon="calendar"
        iconColor="#ef4444"
      />
      <DetailRow
        label="Total Price"
        value={`₹${item?.totalPrice}`}
        icon="pricetag"
        iconColor="#f59e0b"
        isBold
      />
      <DetailRow
        label="Payment Status"
        value={item?.paymentStatus}
        icon="wallet"
        iconColor={item?.paymentStatus === "Paid" ? "#10b981" : "#f43f5e"}
        isHighlight
      />
      <DetailRow
        label="Status"
        value={item?.status}
        icon="checkmark-circle"
        iconColor="#6366f1"
      />
    </View>
  </View>
);

const DetailRow = ({
  label,
  value,
  icon,
  iconColor,
  isBold,
  isHighlight,
}: {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
  isBold?: boolean;
  isHighlight?: boolean;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    }}
  >
    <Ionicons
      name={icon}
      size={20}
      color={iconColor}
      style={{ marginRight: 10 }}
    />
    <Text
      style={{
        flex: 1,
        fontSize: 14,
        color: "#6b7280",
        fontWeight: "500",
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        fontSize: 14,
        color: isHighlight
          ? value === "Paid"
            ? "#10b981"
            : "#f43f5e"
          : "#1f2937",
        fontWeight: isBold ? "bold" : "normal",
      }}
    >
      {value}
    </Text>
  </View>
);

  

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#ffb000" />
      </SafeAreaView>
    );
  }

  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={{marginBottom:120 }}>
        {/* Tabs */}
        <Text
  style={{
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom:10,
    marginTop:20
  }}
>
  My Bookings
</Text>

        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            borderRadius: 12,
            margin:20,
            overflow: "hidden",
            backgroundColor: "#e6e6e6",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: activeTab === "Current" ? "#ffb000" : "#e6e6e6",
              alignItems: "center",
            }}
            onPress={() => setActiveTab("Current")}
          >
            <Text
              style={{
                fontSize: 16,
                color: activeTab === "Current" ? "#fff" : "#333",
                fontWeight: "bold",
              }}
            >
             Current
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: activeTab === "Past" ? "#ffb000" : "#e6e6e6",
              alignItems: "center",
            }}
            onPress={() => setActiveTab("Past")}
          >
            <Text
              style={{
                fontSize: 16,
                color: activeTab === "Past" ? "#fff" : "#333",
                fontWeight: "bold",
              }}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {/* Booking List */}
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                fontSize: 16,
                color: "#999",
              }}
            >
              No bookings found.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
