import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Booking {
    id: string;
    hotel: string;
    date: string;
}

const HistoryScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Recent'>('Upcoming');

    const upcomingBookings: Booking[] = [
        { id: '1', hotel: 'Grand Palace Hotel', date: '2025-02-15' },
        { id: '2', hotel: 'Ocean View Resort', date: '2025-03-10' },
    ];

    const recentBookings: Booking[] = [
        { id: '3', hotel: 'Mountain Retreat', date: '2024-12-20' },
        { id: '4', hotel: 'City Lights Hotel', date: '2024-11-05' },
    ];

    const renderBooking: ListRenderItem<Booking> = ({ item }) => (
        <View style={{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            elevation: 3,
        }}>
            <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333',
            }}>{item.hotel}</Text>
            <Text style={{
                fontSize: 14,
                color: '#666',
                marginTop: 5,
            }}>{item.date}</Text>
        </View>
    );

    // Combine tabs and booking list into a single FlatList
    const renderTabContent = (activeTab: string) => {
        const data = activeTab === 'Upcoming' ? upcomingBookings : recentBookings;
        return (
            <FlatList
                data={data}
                renderItem={renderBooking}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<Text style={{
                    textAlign: 'center',
                    marginTop: 20,
                    fontSize: 16,
                    color: '#999',
                }}>No bookings found.</Text>}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <FlatList
                ListHeaderComponent={
                    <View style={{
                        padding: 20,
                        backgroundColor: '#f9f9f9',
                    }}>
                        {/* Tabs */}
                        <View style={{
                            flexDirection: 'row',
                            marginBottom: 20,
                            borderRadius: 10,
                            overflow: 'hidden',
                        }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    padding: 15,
                                    backgroundColor: activeTab === 'Upcoming' ? '#ffb000' : '#e0e0e0',
                                    alignItems: 'center',
                                }}
                                onPress={() => setActiveTab('Upcoming')}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    color: activeTab === 'Upcoming' ? '#fff' : '#333',
                                    fontWeight: 'bold',
                                }}>Upcoming</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    padding: 15,
                                    backgroundColor: activeTab === 'Recent' ? '#ffb000' : '#e0e0e0',
                                    alignItems: 'center',
                                }}
                                onPress={() => setActiveTab('Recent')}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    color: activeTab === 'Recent' ? '#fff' : '#333',
                                    fontWeight: 'bold',
                                }}>Recent</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                data={[]}
                renderItem={() => renderTabContent(activeTab)} // Content updates based on active tab
                keyExtractor={() => 'dummyKey'} // Placeholder key as no items for FlatList
                ListFooterComponent={<View style={{ paddingBottom: 20 }} />}
            />
        </SafeAreaView>
    );
};

export default HistoryScreen;


// import React, { useState } from "react";
// import {
//   ScrollView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { SafeAreaView } from "react-native-safe-area-context";

// type FormState = {
//   name: string;
//   owner: string;
//   hotelAddress: string;
//   hotelCity: string;
//   hotelState: string;
//   description: string;
//   hotelAmenities: string[];
//   hotelCategory: string;
//   alphaRooms: string;
//   betaRooms: string;
//   gammaRooms: string;
//   alphaPrice: string;
//   betaPrice: string;
//   gammaPrice: string;
//   images: string[];
// };

// const History: React.FC = () => {
//   const [form, setForm] = useState<FormState>({
//     name: "",
//     owner: "",
//     hotelAddress: "",
//     hotelCity: "",
//     hotelState: "",
//     description: "",
//     hotelAmenities: [],
//     hotelCategory: "ICY YELLOW",
//     alphaRooms: "",
//     betaRooms: "",
//     gammaRooms: "",
//     alphaPrice: "",
//     betaPrice: "",
//     gammaPrice: "",
//     images: [],
//   });

//   const handleInputChange = (field: keyof FormState, value: string) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleImageUpload = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       selectionLimit:10,
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       const selectedImages = result.assets.map((asset) => asset.uri);
//       setForm((prev) => ({
//         ...prev,
//         images: [...prev.images, ...selectedImages],
//       }));
//     }
//   };

//   const handleSubmit = async () => {
//     if (
//       !form.name ||
//       !form.owner ||
//       !form.description ||
//       !form.hotelAmenities.length ||
//       !form.alphaRooms ||
//       !form.betaRooms ||
//       !form.gammaRooms
//     ) {
//       Alert.alert("Error", "All required fields must be filled");
//       return;
//     }

//     try {
//       const formData = new FormData();

//       Object.keys(form).forEach((key) => {
//         const field = key as keyof FormState;
//         if (field === "images") {
//           form.images.forEach((imageUri, index) => {
//             formData.append("images", {
//               uri: imageUri,
//               type: "image/jpeg",
//               name: `image_${index}.jpg`,
//             } as any);
//           });
//         } else if (field === "hotelAmenities") {
//           formData.append(field, JSON.stringify(form[field]));
//         } else {
//           formData.append(field, form[field]);
//         }
//       });

//       const response = await fetch("http://your-backend-endpoint/api/hotels", {
//         method: "POST",
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         Alert.alert("Success", "Hotel created successfully!");
//       } else {
//         Alert.alert("Error", result.message || "Failed to create hotel");
//       }
//     } catch (error) {
//       Alert.alert("Error", "An error occurred while creating the hotel");
//     }
//   };

//   return (
//     <SafeAreaView>
//     <ScrollView contentContainerStyle={{ padding: 16 }}>
//       <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
//         Create Hotel
//       </Text>

//       <TextInput
//         placeholder="Hotel Name *"
//         style={styles.input}
//         value={form.name}
//         onChangeText={(value) => handleInputChange("name", value)}
//       />

//       <TextInput
//         placeholder="Owner *"
//         style={styles.input}
//         value={form.owner}
//         onChangeText={(value) => handleInputChange("owner", value)}
//       />

//       <TextInput
//         placeholder="Hotel Address"
//         style={styles.input}
//         value={form.hotelAddress}
//         onChangeText={(value) => handleInputChange("hotelAddress", value)}
//       />

//       <TextInput
//         placeholder="City"
//         style={styles.input}
//         value={form.hotelCity}
//         onChangeText={(value) => handleInputChange("hotelCity", value)}
//       />

//       <TextInput
//         placeholder="State"
//         style={styles.input}
//         value={form.hotelState}
//         onChangeText={(value) => handleInputChange("hotelState", value)}
//       />

//       <TextInput
//         placeholder="Description *"
//         style={{ ...styles.input, height: 80, textAlignVertical: "top" }}
//         value={form.description}
//         multiline
//         onChangeText={(value) => handleInputChange("description", value)}
//       />

//       <TextInput
//         placeholder="Hotel Amenities "
//         style={styles.input}
//         value={form.hotelAmenities.join(", ")}
//         onChangeText={(value) =>
//           handleInputChange(
//             "hotelAmenities",
//             value.split(",").map((item) => item.trim())
//           )
//         }
//       />

//       <Text style={{ marginBottom: 8, fontWeight: "bold" }}>Category *</Text>
//       <View style={{ flexDirection: "row", marginBottom: 16 }}>
//         {["ICY YELLOW", "ICY WHITE", "ICY BLACK"].map((category) => (
//           <TouchableOpacity
//             key={category}
//             style={{
//               flex: 1,
//               padding: 12,
//               backgroundColor:
//                 form.hotelCategory === category ? "#007bff" : "#f0f0f0",
//               alignItems: "center",
//               borderRadius: 8,
//               marginHorizontal: 4,
//             }}
//             onPress={() => handleInputChange("hotelCategory", category)}
//           >
//             <Text
//               style={{
//                 color: form.hotelCategory === category ? "#fff" : "#000",
//               }}
//             >
//               {category}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {["alpha", "beta", "gamma"].map((type) => (
//         <View key={type} style={{ flexDirection: "row", marginBottom: 12 }}>
//           <TextInput
//             placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} Rooms`}
//             style={{ ...styles.input, flex: 1, marginRight: 8 }}
//             value={form[`${type}Rooms` as keyof FormState]}
//             keyboardType="numeric"
//             onChangeText={(value) =>
//               handleInputChange(`${type}Rooms` as keyof FormState, value)
//             }
//           />
//           <TextInput
//             placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} Price`}
//             style={{ ...styles.input, flex: 1 }}
//             value={form[`${type}Price` as keyof FormState]}
//             keyboardType="numeric"
//             onChangeText={(value) =>
//               handleInputChange(`${type}Price` as keyof FormState, value)
//             }
//           />
//         </View>
//       ))}

//       <TouchableOpacity
//         style={{ ...styles.button, marginBottom: 16 }}
//         onPress={handleImageUpload}
//       >
//         <Text style={{ color: "#fff" }}>Upload Images</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={{ color: "#fff", fontWeight: "bold" }}>Create Hotel</Text>
//       </TouchableOpacity>
//     </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     borderWidth: 1,
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   submitButton: {
//     backgroundColor: "#28a745",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
// });

// export default History;