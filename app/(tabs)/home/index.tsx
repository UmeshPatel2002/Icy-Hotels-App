import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text,TouchableOpacity, ScrollView, Image, Modal, Dimensions, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLatitude, setLongitude, setUserAddress, setUserDetails } from '@/redux/reducers/userSlice';
import { formatDateRange } from '@/logics/logics';
import { setCheckInDate, setCheckOutDate, setRooms } from '@/redux/reducers/hotelSlice';
import * as Location from "expo-location";

const popularCities = [
  { name: 'Noida', image: 'https://images.unsplash.com/photo-1619542402915-dcaf30e4e2a1?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1598977054780-2dc700fdc9d3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1625731226721-b4d51ae70e20?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Gurugram', image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Jhansi', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Ghaziabad', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Chennai', image: 'https://plus.unsplash.com/premium_photo-1666805690489-59d72f05b371?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const HomeScreen = () => {
  const [datesModal, setDatesModal] = useState(false);
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRoomsLocal] = useState<number>(1);
  const { width, height } = Dimensions.get('window');
  const location = useSelector((state: any) => state.hotel.searchLocation)
  const user = useSelector((state: any) => state.user.userDetails)
  const dispatch = useDispatch();
  const checkInDate = useSelector((state: any) => state.hotel.checkInDate)
  const checkOutDate = useSelector((state: any) => state.hotel.checkOutDate)
  const room = useSelector((state: any) => state.hotel.rooms);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [address, setAddress] = useState("")
  const OPENCAGE_API_KEY = "144cab81ca2e4a5ea65feeae1b07d6e9"
  // console.log(checkInDate, checkOutDate,room)
  const router = useRouter()
  const segments = useSegments();
  console.log(segments)

  useEffect(() => {
    const backAction = () => {
      if (segments.length === 2 && segments[1] === 'home') {
        BackHandler.exitApp(); 
      } else {
        router.back();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
       backAction
    );

    return () => backHandler.remove(); 
  }, [segments, router]);


  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    // Format the date as YYYY-MM-DD using local date methods
    const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const tomorrowString = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`;
  
    console.log("today:", todayString, "tomorrow:", tomorrowString,"Home");
    
    dispatch(setCheckInDate(todayString));
    dispatch(setCheckOutDate(tomorrowString));
  }, []);
  
  console.log("Home: Me Umesh Patel ");

  const fetchLocation = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        return;
      }
      const locationOptions = {
        accuracy: Location.Accuracy.BestForNavigation,  // Best accuracy for navigation
        timeInterval: 5000,  // 5 seconds interval for faster updates
        distanceInterval: 1, // Update every 1 meter moved
      };
      // Get current position
      const locationData = await Location.getCurrentPositionAsync(locationOptions);
      // setLoc(locationData?.coords);
      // console.log("Location: ", locationData)

      // Use OpenCage API for reverse geocoding
      const { latitude, longitude } = locationData.coords;
      dispatch(setLatitude(latitude))
      dispatch(setLongitude(longitude))
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${OPENCAGE_API_KEY}`
      );
      // console.log("Address: ", response.data?.results[0]?.formatted)

      // Set the address in state
      if (response.data.results.length > 0) {
        const formattedAddress = response.data.results[0]?.formatted;

        setAddress(formattedAddress);

        dispatch(setUserAddress(formattedAddress));
      } else {
        setErrorMsg("Failed to fetch address.");
      }
    } catch (error:any) {
      setErrorMsg("Error fetching location: "+error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchLocation();
  }, []);


  // Logic to update room count based on guest count
  const updateRooms = (newRooms: number) => {
    // console.log('newRooms', newRooms);
    if (newRooms < rooms && guests > newRooms * 2) return;
    setRoomsLocal(newRooms);
    dispatch(setRooms(newRooms));

  };
  const updateGuests = (newGuestCount: number) => {
    const calculatedRooms = Math.ceil(newGuestCount / 2); // 2 guests per room
    setRoomsLocal(Math.max(rooms, calculatedRooms));

    setGuests(newGuestCount);
    dispatch(setRooms(Math.max(rooms, calculatedRooms)));
  }

  const handleHotelSearch = async () => {

    router.push({
      pathname: "/home/search/booking",
      params: { location: location },
    });
  }

  useEffect(() => {
    dispatch(setRooms(1));
    fetchUserData();
  }, [user?._id]);

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userDetails");
      console.log("fetching user data");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        dispatch(setUserDetails(parsedUserData));
      }

    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false}  style={{ flex: 1 }}>
        {/* Navbar with Logo */}
        <View style={{
          flex: 1,
          padding: 10,
          backgroundColor: '#fff',
          paddingVertical: 20,
          paddingHorizontal: 20,
          borderBottomStartRadius: 15,
          borderBottomEndRadius: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 10,

        }}>
          {/* Header Section with Logo and Address */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 0,
          }}>
            {/* Logo */}
            <Image
              source={{ uri: 'https://res.cloudinary.com/kumarvivek/image/upload/v1735634569/icy_afyl3a.png' }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 12,
              }}
            />

            {/* Address Section with Modern Location Icon */}
            <View style={{
              flex: 1,
              marginLeft: 15,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
              {/* Modern Location Icon */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 0,
              }}>
                <Ionicons name="location-outline" size={16} color="#ffb000" />
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Nunito-Regular',
                  color: '#ffb000',
                  marginLeft: 5,
                }}>
                  Location
                </Text>
              </View>
              {/* Display Address */}
              {address ? (
                <Text style={{
                  fontSize: 10,
                  fontFamily: 'Nunito-Light',
                  color: '#333',
                  textAlign: 'right',
                  maxWidth: '60%',
                  paddingRight: 5,
                  letterSpacing: 1,
                }}>
                  {address?.substring(0, 35)}...
                </Text>
              ) : (
                <Text style={{
                  fontSize: 10,
                  fontFamily: 'Nunito-Light',
                  color: '#333',
                  textAlign: 'right',
                  paddingRight: 5,
                }}>
                  Fetching address...
                </Text>
              )}
            </View>
          </View>

          {/* Title Section */}

        </View>
        <Text style={{
          fontSize: 22,
          fontFamily: 'Nunito-Bold',
          marginVertical: 20,
          textAlign: 'center',
          color: '#3E4A59',
          fontWeight: 'bold',
        }}>
          Where can we take you?
        </Text>

        {/* Search Form */}
        <View style={{
          padding: 15, backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 15, shadowColor: '#bdbdbd', shadowOpacity: 0.25, shadowRadius: 10, elevation: 8, shadowOffset: {
            width: 0,
            height: 2
          }
        }}>

          <TouchableOpacity onPress={() => { router.push('/(tabs)/home/search/setDestination') }} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginBottom: 10, backgroundColor: '#fff' }}>
            <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 12, fontWeight: 100, paddingHorizontal: 5 }}>Destination</Text>
            <Text style={{ fontFamily: 'Nunito-Medium', fontSize: 14, paddingHorizontal: 5 }}>{location ? location : "Noida"}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <TouchableOpacity onPress={() => { router.push('/(tabs)/home/search/setDates') }} style={{
              flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, paddingHorizontal: 5, marginBottom: 10, backgroundColor: '#fff', marginRight: 5
            }}>
              <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 12, fontWeight: '100', paddingHorizontal: 5 }}>
                Dates
              </Text>
              <Text style={{ fontFamily: 'Nunito-Medium', fontSize: 14, paddingHorizontal: 5 }}>
                {(checkInDate && checkOutDate) ? formatDateRange(checkInDate, checkOutDate) : "Jan 1 - Jan 2"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDatesModal(true); dispatch(setRooms(1)) }} style={{
              flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, paddingHorizontal: 5, marginBottom: 10, backgroundColor: '#fff', marginLeft: 5
            }}>
              <Text style={{
                fontFamily: 'Nunito-Regular', fontSize: 12, fontWeight: '100', paddingHorizontal: 5
              }}>
                Rooms & Guest
              </Text>
              <Text style={{
                fontFamily: 'Nunito-Medium', fontSize: 14, paddingHorizontal: 5
              }}>
                {rooms} Room - {guests} Guest
              </Text>
            </TouchableOpacity>
          </View>


          <TouchableOpacity onPress={() => { handleHotelSearch(); console.log('go to hotels') }} style={{ backgroundColor: '#ffb000', padding: 15, borderRadius: 5, alignItems: 'center' }} >
            <Text style={{ color: '#fff', fontFamily: "Nunito-SemiBold", fontSize: 16 }}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Cities */}
        <Text style={{ fontSize: 18, fontFamily: "Nunito-SemiBold", marginHorizontal: 15, marginTop: 20 }}>Popular Cities</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {popularCities.map((city) => (
            <TouchableOpacity onPress={() => {
              router.push({
                pathname: "/explore",
                params: { city: city.name },
              });
            }} key={Math.random()} style={{ alignItems: 'center', marginHorizontal: 10 }}>
              <Image source={{ uri: city.image }} style={{ width: 80, height: 80, borderRadius:50,
                shadowColor:"#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 10,

               }} />
              <Text style={{ marginTop: 5, fontSize: 14, fontFamily: "Nunito-Medium", }}>{city.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>


        {/* Additional Section: Offers */}
        <Text style={{ fontSize: 18, fontFamily: "Nunito-SemiBold", marginHorizontal: 15, marginTop: 20 }}>Exclusive Offers</Text>
        <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
          <View style={{ backgroundColor: '#ffefd5', padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ fontSize: 16, color: '#333', fontFamily: "Nunito-SemiBold", }}>20% Off on First Booking!</Text>
          </View>
          <View style={{ backgroundColor: '#ffefd5', padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ fontSize: 16, color: '#333', fontFamily: "Nunito-SemiBold", }}>Free Breakfast in Selected Hotels</Text>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={datesModal}
        animationType="slide"
        onRequestClose={() => setDatesModal(false)}
        onDismiss={() => setDatesModal(false)}

        transparent={true}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 10
        }}>
          <View style={{
            width: width,
            height: height * 0.5,
            position: 'absolute',
            bottom: 0,
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 16,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0 }}>
              <Text style={{ fontSize: 18, fontFamily: 'Nunito-SemiBold', marginBottom: 20 }}>Select Room & Guests</Text>
              <TouchableOpacity onPress={() => { setDatesModal(false) }}>
                <Entypo name="cross" size={28} color="black" />
              </TouchableOpacity>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontSize: 14, marginRight: 10, fontFamily: 'Nunito-Regular' }}>Number of Guests:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => updateGuests(guests - 1 < 1 ? 1 : guests - 1)}>
                  <Ionicons name="remove-circle-outline" size={24} color="#ffb000" />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, marginHorizontal: 10 }}>{guests}</Text>
                <TouchableOpacity onPress={() => updateGuests(guests + 1)}>
                  <Ionicons name="add-circle-outline" size={24} color="#ffb000" />
                </TouchableOpacity>
              </View>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <Text style={{ fontSize: 14, marginRight: 10, fontFamily: 'Nunito-Regular' }}>Number of Rooms:</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <TouchableOpacity onPress={() => updateRooms(rooms - 1 < 1 ? 1 : rooms - 1)}>
                  <Ionicons name="remove-circle-outline" size={24} color="#ffb000" />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, marginHorizontal: 10 }}>{rooms}</Text>
                <TouchableOpacity onPress={() => updateRooms(rooms + 1)}>
                  <Ionicons name="add-circle-outline" size={24} color="#ffb000" />
                </TouchableOpacity>
              </View>

            </View>


            {/* <Button title="Close" onPress={closeModal} /> */}
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
};

export default HomeScreen;
