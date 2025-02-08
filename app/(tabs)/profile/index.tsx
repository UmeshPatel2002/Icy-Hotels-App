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
  const [editingEmailField, setEditingEmailField] = useState(false);

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
      updateProfileImage(result?.assets[0]?.uri);
    }
  };

  const updateProfileImage = async (img: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      // console.log(img)
      if (img) {
        formData.append("images", {
          uri: img,
          name: `profile_img_${Date.now()}_${Math.floor(
            Math.random() * 100000
          )}.jpg`,
          type: "image/jpeg",
        } as any);
      }
      formData.append("userId", user?._id);
      // console.log("formdata",formData);
      const res = await axios.post(
        `${baseUrl}/users/update-user-profile`,
        formData
      );
      if (res.data) {
        // console.log("Image updated successfully",res.data);
        setLoading(false);

        dispatch(setUserDetails(res.data));
        await AsyncStorage.setItem("userDetails", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Error updating profile image: ", error);
      setLoading(false);
    }
  };

  const updateUserInfo = async (field: any, value: any) => {
    try {
      console.log("Updating profile image", field, value);
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
      setEditingEmailField(false);
    } catch (error) {
      console.error("Error updating user info: ", error);
    } finally {
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

            <Text
              style={{ marginLeft: 10, fontSize: 16, color: "#333", flex: 1 }}
            >
              {user?.address || "XYZ, INDIA"}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
                alignItems: "center",
                gap: 10,
              }}
            >
              {user ? ( // Only allow email editing if user exists
                editingEmailField ? (
                  <TextInput
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      color: "#333",
                      flex: 1,
                    }}
                    value={email}
                    onChangeText={setEmail}
                    editable={true}
                  />
                ) : (
                  <ScrollView
                    horizontal
                    style={{ width: "70%", marginLeft: 10 }}
                  >
                    <Text
                      style={{ width: "100%", fontSize: 16, color: "#333" }}
                    >
                      {user.email || "abc@gmail.com"}
                    </Text>
                  </ScrollView>
                )
              ) : (
                <Text style={{ fontSize: 16, color: "#333" , marginLeft: 10 }}>
                  abc@gmail.com
                </Text>
              )}

              {/* Show Edit button only if user exists */}
              {user && (
                <>
                  {editingEmailField ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#28a745", // Green color
                        borderRadius: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 5,
                        justifyContent: "center",
                      }}
                      onPress={() => updateUserInfo("email", email)}
                    >
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#ffb000",
                        borderRadius: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 5,
                        justifyContent: "center",
                      }}
                      onPress={() => setEditingEmailField(true)}
                    >
                      <Ionicons name="pencil" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
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
                    fontWeight: "bold",
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
                    fontWeight: "bold",
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
                    fontFamily: "Poppins-SemiBold",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  Welcome!
                </Text>
                <Text style={{ fontSize: 14, textAlign: "center" }}>
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
    </SafeAreaView>
  );
};

export default UserProfile;
