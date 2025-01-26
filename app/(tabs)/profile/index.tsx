// import React, { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Calendar } from 'react-native-calendars';

// const UserProfile = () => {
//     const [dob, setDob] = useState('2002-01-01'); // Default DOB
//     const [showDatePicker, setShowDatePicker] = useState(false);

//     const handleDateChange = () => {

//     };

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
//             <ScrollView>

//                 {/* Profile Picture Section */}
//                 <View style={{ alignItems: 'center', marginTop: 40 }}>
//                     <View style={{ position: 'relative', backgroundColor: 'fff', }}>
//                         <Image
//                             source={{
//                                 uri: 'https://via.placeholder.com/150', // Replace with the actual profile image URL
//                             }}
//                             style={{
//                                 width: 120,
//                                 height: 120,
//                                 borderRadius: 60,
//                                 borderWidth: 3,
//                                 borderColor: '#fff',
//                                 backgroundColor: '#eee',
//                             }}
//                         />
//                         <TouchableOpacity
//                             style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 right: 0,
//                                 backgroundColor: '#ffb000',
//                                 borderRadius: 20,
//                                 padding: 5,
//                                 elevation: 5,
//                             }}
//                             onPress={() => alert('Edit Photo')}
//                         >
//                             <Ionicons name="pencil" size={16} color="#fff" />
//                         </TouchableOpacity>
//                     </View>
//                     <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
//                         Vivek Kumar
//                     </Text>
//                     <Text style={{ fontSize: 14, color: '#666' }}>+917055029251</Text>
//                 </View>

//                 {/* Profile Details Section */}
//                 <View style={{ margin: 20 }}>
//                     {/* Address */}
//                     <View
//                         style={{
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             backgroundColor: '#fff',
//                             padding: 15,
//                             borderRadius: 10,
//                             marginBottom: 10,
//                             elevation: 2,
//                         }}
//                     >
//                         <Ionicons name="location-outline" size={20} color="#666" />
//                         <Text style={{ marginLeft: 10, fontSize: 16, color: '#333' }}>
//                             Jhansi Uttar Pradesh
//                         </Text>
//                     </View>

//                     {/* Date of Birth */}
//                     {/* <TouchableOpacity
//                         style={{
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             backgroundColor: '#fff',
//                             padding: 15,
//                             borderRadius: 10,
//                             marginBottom: 10,
//                             elevation: 2,
//                         }}
//                         onPress={() => handleDateChange()}
//                     >
//                         <Ionicons name="calendar-outline" size={20} color="#666" />
//                         <Text style={{ marginLeft: 10, fontSize: 16, color: '#333' }}>{dob}</Text>
//                     </TouchableOpacity> */}

//                     {/* Show Date Picker */}

//                     {/* <Calendar
//                         theme={{
//                             selectedDayBackgroundColor: '#ffb000',
//                             todayTextColor: '#ffb000',
//                             arrowColor: '#ffb000',
//                         }} /> */}
//                     {/* Email */}
//                     <View
//                         style={{
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             backgroundColor: '#fff',
//                             padding: 15,
//                             borderRadius: 10,
//                             marginBottom: 10,
//                             elevation: 2,
//                         }}
//                     >
//                         <Ionicons name="mail-outline" size={20} color="#666" />
//                         <Text style={{ marginLeft: 10, fontSize: 16, color: '#333' }}>
//                             vpwr2004@gmail.com
//                         </Text>
//                     </View>

//                     <View
//                         style={{
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             backgroundColor: '#fff',
//                             padding: 15,
//                             borderRadius: 10,
//                             elevation: 2,
//                         }}
//                     >
//                         <Ionicons name="happy-outline" size={20} color="#666" />
//                         <Text style={{ marginLeft: 10, fontSize: 16, color: '#333' }}>Male</Text>
//                     </View>
//                 </View>

//                 {/* Footer */}
//                 <View style={{ alignItems: 'center', marginTop: 'auto', marginBottom: 20 }}>
//                     <Text style={{ fontSize: 16, fontStyle: 'italic', color: '#666' }}>
//                         Icy Hotels
//                     </Text>
//                     <Text style={{ fontSize: 12, color: '#999' }}>Connect with us</Text>
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// export default UserProfile;

import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const [dob, setDob] = useState("2002-01-01"); // Default DOB
  const router = useRouter();
  const user = useSelector((state: any) => state.user.userDetails);
  console.log(user?.length);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView>
        {/* Profile Picture Section */}
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <View style={{ position: "relative", backgroundColor: "fff" }}>
            <Image
              source={{
                uri: user?.image || "https://avatar.iran.liara.run/public/17", // Replace with the actual profile image URL
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 3,
                borderColor: "#fff",
                backgroundColor: "#eee",
              }}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#ffb000",
                borderRadius: 20,
                padding: 5,
                elevation: 5,
              }}
              onPress={() => alert("Edit Photo")}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
            {user?.name ? `${user?.name}` : "User"}
          </Text>
          <Text style={{ fontSize: 14, color: "#666" }}>
            {user?.phoneNumber ? `${user?.phoneNumber}` : "+91XXXXXXXXXX"}
          </Text>
        </View>

        {/* Profile Details Section */}
        <View style={{ margin: 20 }}>
          {/* Address */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
              elevation: 2,
            }}
          >
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={{ marginLeft: 10, fontSize: 16, color: "#333" }}>
              {user?.address ? user?.address : "XYZ, INDIA"}
            </Text>
          </View>

          {/* Email */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
              elevation: 2,
            }}
          >
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={{ marginLeft: 10, fontSize: 16, color: "#333" }}>
              {user?.email ? user?.email : "abc@gmail.com"}
            </Text>
          </View>

          {/* Gender */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              elevation: 2,
            }}
          >
            <Ionicons name="happy-outline" size={20} color="#666" />
            <Text style={{ marginLeft: 10, fontSize: 16, color: "#333" }}>
              {user?.gender ? user?.gender : "Male"}
            </Text>
          </View>

          {/* History Button */}
          {
            user?.length>0 && 
            <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#ffb000",
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
              justifyContent: "center",
            }}
            onPress={() => {
              router.push("/profile/history");
              console.log("go to history");
            }}
          >
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Booking History
            </Text>
          </TouchableOpacity>
          }
          

          {user?.length===0 && (
            <View>
                <View style={{marginTop:20,justifyContent:"center",alignItems:"center"}}>
                    <Text style={{fontFamily:"Poppins-SemiBold",fontSize:16,textAlign:"center"}}> 
                        Welcome!
                    </Text>
                    <Text style={{fontSize:14,textAlign:"center"}}>
                        Please signup / login
                    </Text>
                    </View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#ffb000",
                  padding: 15,
                  borderRadius: 10,
                  marginTop: 20,
                  justifyContent: "center",
                }}
                onPress={() => {
                  router.push("/profile/login");
                  console.log("go to signup");
                }}
              >
                <Ionicons name="time-outline" size={20} color="#fff" />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  SignUp / Login
                </Text>
              </TouchableOpacity>
             
            </View>
          )}
        </View>

        {/* Footer */}
        <View
          style={{ alignItems: "center", marginTop: "auto", marginBottom: 20 }}
        >
          <Text style={{ fontSize: 16, fontStyle: "italic", color: "#666" }}>
            Icy Hotels
          </Text>
          <Text style={{ fontSize: 12, color: "#999" }}>Connect with us</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;
