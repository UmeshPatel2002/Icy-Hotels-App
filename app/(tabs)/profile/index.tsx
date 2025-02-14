import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setPhone, setUserDetails } from "@/redux/reducers/userSlice";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { baseUrl } from "@/constants/server";

const UserProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.userDetails);
  console.log("usr", user?._id);
  const [logOutModal, setLogOutModal] = useState(false);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState(user?.address || "");
  const [email, setEmail] = useState(user?.email || "");
  const [gender, setGender] = useState(user?.gender || "Male");
  const [editingEmailField, setEditingEmailField] = useState(false);
  const [editingLocationField, setEditingLocationField] = useState(false);
  const [editingGenderField, setEditingGenderField] = useState(false);

  useEffect(() => {
    dispatch(setPhone(""));
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userDetails");
      console.log("fetching user data", userData);
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        dispatch(setUserDetails(parsedUserData));
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const logout = async () => {
    try {
      // console.log("logout");
      await AsyncStorage.removeItem("userDetails");
      await auth().signOut();
      dispatch(setUserDetails(null));
      dispatch(setPhone(""));

      setLogOutModal(false);
    } catch (error) {
      console.error("Error signing out: ", error);
      setLogOutModal(false);
    }
  };

  const handleCancel = () => {
    setLogOutModal(false); // Simply close the modal
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result?.canceled) {
      setImage(result?.assets[0]?.uri);
      // console.log(result,"uriiiiiii");
      updateProfileImage(result?.assets[0]);
    }
  };

  const updateProfileImage = async (img: any) => {
    try {
      if (!img || !img.uri) {
        console.error("Invalid image provided.", img);
        return;
      }

      setLoading(true);
      const formData = new FormData();
      if (img) {
        formData.append("images", {
          uri: img?.uri,
          name: img?.fileName || `profile_${Date.now()}.jpg`,
          type: img?.mimeType || "image/jpeg",
        });
      }

      if (!user?._id) {
        console.error("User ID is missing.");
        setLoading(false);
        return;
      }

      formData.append("userId", user._id);

      console.log("Uploading image...", formData);

      const res = await axios.post(
        `${baseUrl}/users/update-user-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (res.data) {
        console.log("Image uploaded successfully:", res.data);
        setLoading(false);
        dispatch(setUserDetails(res.data));
        await AsyncStorage.setItem("userDetails", JSON.stringify(res.data));
      } else {
        throw new Error("No response data received.");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      setLoading(false);
    }
  };

  const updateUserInfo = async (field: any, value: any) => {
    try {
      setLoading(true);
      const res = await axios.patch(`${baseUrl}/users/update-user-profile`, {
        userId: user?._id,
        updatedFields: { [field]: value },
      });
      if (res.data) {
        // console.log("User info updated successfully", res.data);
        dispatch(setUserDetails(res.data));
        await AsyncStorage.setItem("userDetails", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Error updating user info: ", error);
    } finally {
      setEditingEmailField(false);
      setEditingLocationField(false);
      setEditingGenderField(false);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView>
        {/* Profile Picture Section */}
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <View style={{ position: "relative", backgroundColor: "fff" }}>
            <Image
              source={{
                uri:
                  image ||
                  user?.userImage ||
                  "https://avatar.iran.liara.run/public/17", // Replace with the actual profile image URL
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
            {user?._id && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 5,
                  backgroundColor: "#ffb000",
                  borderRadius: 20,
                  padding: 5,
                  elevation: 5,
                }}
                onPress={() => pickImage()}
              >
                <Ionicons name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Nunito-SemiBold",
              marginTop: 10,
            }}
          >
            {user?.name ? `${user?.name}` : "User"}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Nunito-Regular",
              color: "#666",
            }}
          >
            {user?.phoneNumber ? `${user?.phoneNumber}` : "+91XXXXXXXXXX"}
          </Text>
        </View>

        {/* Profile Details Section */}
        <View style={{ margin: 20 }}>
          {/* Address */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
              elevation: 2,
            }}
            onPress={() => setEditingLocationField(true)}
          >
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text
              style={{ marginLeft: 10, fontSize: 16, color: "#333", flex: 1 }}
            >
              {user?.location || "XYZ, INDIA"}
            </Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
              elevation: 2,
            }}
            onPress={() => setEditingEmailField(true)}
          >
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
                fontFamily: "Nunito-Regular",
                color: "#333",
              }}
            >
              {user.email || "abc@gmail.com"}
            </Text>
          </TouchableOpacity>

          {/* Gender */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              elevation: 2,
            }}
            onPress={() => setEditingGenderField(true)}
          >
            <Ionicons name="happy-outline" size={20} color="#666" />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
                fontFamily: "Nunito-Regular",
                color: "#333",
              }}
            >
              {user?.gender ? user?.gender : "Male"}
            </Text>
          </TouchableOpacity>

          {/* History Button */}
          {user && (
            <View
              style={{
                gap: 10,
              }}
            >
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
                    fontFamily: "Nunito-SemiBold",
                  }}
                >
                  My Bookings
                </Text>
              </TouchableOpacity>
              {/* button for logout */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#333",
                  padding: 15,
                  borderRadius: 10,
                  marginTop: 10,
                  justifyContent: "center",
                }}
                onPress={() => {
                  setLogOutModal(true); // show logout modal
                  console.log("logout");
                }}
              >
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    color: "#fff",
                    fontFamily: "Nunito-SemiBold",
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {!user && (
            <View>
              <View
                style={{
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-SemiBold",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  Welcome!
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Nunito-SemiBold",
                    textAlign: "center",
                  }}
                >
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
                    fontFamily: "Nunito-SemiBold",
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
          <Text
            style={{ fontSize: 16, fontFamily: "Nunito-Italic", color: "#666" }}
          >
            Icy Hotels
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Nunito-Regular",
              color: "#999",
            }}
          >
            Connect with us
          </Text>
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        visible={logOutModal}
        animationType="fade"
        onRequestClose={handleCancel} // Close modal when back button is pressed on Android
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              paddingVertical: 60,
              borderRadius: 10,
              width: 300,
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 18, marginBottom: 20, fontWeight: "bold" }}
            >
              Are you sure you want to log out?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <Button title="Cancel" onPress={handleCancel} color="gray" />
              <Button
                title="Confirm"
                onPress={() => {
                  logout();
                }}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={editingLocationField}
        animationType="slide"
        onRequestClose={() => setEditingLocationField(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              width: "100%",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          >
            {/* Header Line */}
            <View
              style={{
                width: 50,
                height: 5,
                backgroundColor: "#ccc",
                borderRadius: 10,
                marginBottom: 15,
              }}
            />

            <Text
              style={{
                fontSize: 18,
                fontFamily: "Nunito-Bold",
                marginBottom: 10,
              }}
            >
              Enter Location
            </Text>

            {/* Input Field */}
            <TextInput
              style={{
                width: "100%",
                padding: 12,
                borderBottomWidth: 1,
                borderColor: "#ccc",
                fontSize: 16,
                fontFamily: "Nunito-Regular",
                marginBottom: 20,
              }}
              placeholder="Enter your location"
              value={location}
              onChangeText={setLocation}
            />

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#E0E0E0",
                  padding: 12,
                  borderRadius: 30,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={() => setEditingLocationField(false)}
              >
                <Text
                  style={{ color: "#333", fontSize: 16, fontWeight: "bold" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#fbb000",
                  padding: 12,
                  borderRadius: 30,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={() => updateUserInfo("location", location)}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={editingEmailField}
        animationType="slide"
        onRequestClose={() => setEditingEmailField(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              width: "100%",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          >
            {/* Header Line */}
            <View
              style={{
                width: 50,
                height: 5,
                backgroundColor: "#ccc",
                borderRadius: 10,
                marginBottom: 15,
              }}
            />

            <Text
              style={{
                fontSize: 18,
                fontFamily: "Nunito-Bold",
                marginBottom: 10,
              }}
            >
              Enter Email
            </Text>

            {/* Input Field */}
            <TextInput
              style={{
                width: "100%",
                padding: 12,
                borderBottomWidth: 1,
                borderColor: "#ccc",
                fontSize: 16,
                fontFamily: "Nunito-Regular",
                marginBottom: 20,
              }}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#E0E0E0",
                  padding: 12,
                  borderRadius: 30,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={() => setEditingEmailField(false)}
              >
                <Text
                  style={{ color: "#333", fontSize: 16, fontWeight: "bold" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#fbb000",
                  padding: 12,
                  borderRadius: 30,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={() => updateUserInfo("email", email)}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={editingGenderField}
        animationType="slide"
        onRequestClose={() => setEditingGenderField(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              width: "100%",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          >
            {/* Header Drag Indicator */}
            <View
              style={{
                width: 50,
                height: 5,
                backgroundColor: "#ccc",
                borderRadius: 10,
                marginBottom: 15,
              }}
            />

            {/* Title */}
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Nunito-Bold",
                marginBottom: 10,
              }}
            >
              Select Your Gender
            </Text>

            {/* Gender Selection */}
            <View style={{ width: "100%", marginBottom: 20 }}>
              {["Male", "Female", "Other"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderColor: "#ddd",
                  }}
                  onPress={() => setGender(option)}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: gender === option ? "#fbb000" : "#aaa",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    {gender === option && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: "#fbb000",
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Nunito-Regular",
                      color: "#333",
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {/* Cancel Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#E0E0E0",
                  padding: 12,
                  borderRadius: 30,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={() => setEditingGenderField(false)}
              >
                <Text
                  style={{ color: "#333", fontSize: 16, fontWeight: "bold" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* Save Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#fbb000",
                  padding: 12,
                  borderRadius: 30,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={() => updateUserInfo("gender", gender)}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserProfile;
