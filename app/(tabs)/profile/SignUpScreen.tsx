import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert, Dimensions, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { baseUrl } from "@/constants/server";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "@/redux/reducers/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male");
  const [location,setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { width, height } = Dimensions.get("window");
  const dispatch = useDispatch();
  const phoneNumber = useSelector((state: any) => state.user.phone);
  const router = useRouter();

    // const pickImage = async () => {
    //   const result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     allowsEditing: true,
    //     aspect: [1, 1],
    //     quality: 1,
    //   });

    //   if (!result?.canceled) {
    //     setImage(result?.assets[0]?.uri);
    //   }
    // };

  const handleSignup = async () => {
    if (!name) {
      setError("Please enter name*")
      return;
    }
    if (!email) {
      setError("Please enter email*");
      return;
    }
    if (!gender) {
      setError("Please select gender*");
      return;
    }
    setLoading(true);
   console.log(name,email,gender)
    try {
      const res = await axios.post(`${baseUrl}/users/create-user`, {
        phoneNumber: phoneNumber,
        name,
        email,
        gender,

      });
      if (res.data) {
        console.log(res.data)
        dispatch(setUserDetails(res?.data?.data));
        await AsyncStorage.setItem('userDetails', JSON.stringify(res?.data?.data));
        router.replace("/(tabs)/profile");
        setLoading(false);
      }

    } catch (error: any) {
      setError(error);
      setLoading(false);
      console.log("Error creating user", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, position: "relative", backgroundColor: "#fff",  }}>
      <ScrollView
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
      >
        {/* <View style={{ alignItems: "center", marginBottom: 30, padding: 20  }}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: "#ddd",
                backgroundColor: "#eee",
              }}
            />
          ) : (
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#eee",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#ddd",
              }}
            >
              <Ionicons name="camera-outline" size={40} color="#666" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>
          Upload Profile Picture
        </Text>
            </View> */}
        <Text style={{ fontSize: 22, marginBottom: 10, fontFamily: "Poppins-Medium" }}>Create Account</Text>

        <Text style={{ fontSize: 16, marginVertical: 10, marginBottom: 2, fontFamily: "Poppins-Regular" }}>Name</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 20,
            backgroundColor: "#fff",
          }}
          placeholder="Enter your name *"
          value={name}
          onChangeText={(val)=>{setName(val)}}
        />

        <Text style={{ fontSize: 16, marginVertical: 6, marginBottom: 2, fontFamily: "Poppins-Regular" }}>Email</Text>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 20,
            backgroundColor: "#fff",
          }}
          placeholder="Enter your email *"
          value={email}
          onChangeText={(val)=>{setEmail(val)}}
        />
        <Text style={{ fontSize: 16, marginVertical: 6, marginBottom: 2, fontFamily: "Poppins-Regular" }}>Gender</Text>


        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: gender === "Male" ? "#ffb000" : "#fff",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              marginRight: 10,
              alignItems: "center",
            }}
            onPress={() => setGender("Male")}
          >
            <Text style={{ color: gender === "Male" ? "#fff" : "#333" }}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,

              padding: 10,
              backgroundColor: gender === "Female" ? "#ffb000" : "#fff",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              alignItems: "center",
            }}
            onPress={() => setGender("Female")}
          >
            <Text style={{ color: gender === "Female" ? "#fff" : "#333" }}>Female</Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={{ color: "red", marginBottom: 10, fontSize: 16 }}>{error}</Text>}
      

      <TouchableOpacity
        style={{
          padding: 15,
          backgroundColor: "#ffb000",
          borderRadius: 10,
          marginBottom: 20,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          elevation: 5,
          marginTop: 200,
          // marginHorizontal: 10,
          shadowColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
        disabled={loading}
        onPress={handleSignup}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Sign Up</Text>
        )}
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
