import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, Dimensions, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import { useSelector } from 'react-redux';
import axios from "axios"


const HomeScreen = () => {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [roomsGuests, setRoomsGuests] = useState('');
  const [datesModal, setDatesModal] = useState(false);
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);
  const { width, height } = Dimensions.get('window');
  const location=useSelector((state:any)=>state.hotel.searchLocation)
const router=useRouter()
  const segments = useSegments(); // Get the current route segments
  console.log(segments)

  useEffect(() => {
    const backAction = () => {
      // Check if the user is on the Home screen
      if (segments.length === 2 && segments[1] === 'home') {
        BackHandler.exitApp(); // Exit the app
      } else {
        router.back(); // Go back to the previous screen
      }
      return true; // Indicate that the back action is handled
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [segments, router]);


  // Logic to update room count based on guest count
  const updateRooms = (newRooms: number) => {
    console.log('newRooms', newRooms);
    if (newRooms < rooms && guests > newRooms * 2) return;
    setRooms(newRooms);
  };
  const updateGuests = (newGuestCount: number) => {
    const calculatedRooms = Math.ceil(newGuestCount / 2); // 2 guests per room
    setRooms(Math.max(rooms, calculatedRooms));
    setGuests(newGuestCount);
  }
  // Show modal on button click

 

  const popularCities = [
    { name: 'Noida', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Gurugram', image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Jhansi', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Gaziabad', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Delhi', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Mumbai', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Bangalore', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Chennai', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  const nearByHotels=[
    { name: 'Hotel 1', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Hotel 2', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90'},
    { name: 'Hotel 3', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90'},
    { name: 'Hotel 4', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90'},
    { name: 'Hotel 5', image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90'}
  ]
  const handleSearch = () => {
    console.log('Search clicked with:', { destination, dates, roomsGuests });
  };

  const handleHotelSearch=async()=>{
    
     router.push({
      pathname: "/home/search/booking",
      params: { location:location},
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Navbar with Logo */}
        <View style={{ backgroundColor: '#fff', padding: 10, alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd', elevation: 10 }}>
          <Image
            source={{ uri: 'https://res.cloudinary.com/kumarvivek/image/upload/v1735634569/icy_afyl3a.png' }}
            style={{ width: 60, height: 60 }}
          />
        </View>

        <Text style={{ fontSize: 20, fontFamily:"Poppins-SemiBold", marginVertical: 20, textAlign: 'center' }}>Where can we take you?</Text>

        {/* Search Form */}
        <View style={{ padding: 15, backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 15, shadowColor: '#bdbdbd', shadowOpacity: 0.25, shadowRadius: 10, elevation: 8,shadowOffset:{
            width:0,
            height:2
        } }}>

          <TouchableOpacity onPress={() => { router.push('/(tabs)/home/search/setDestination') }} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginBottom: 10, backgroundColor: '#fff' }}>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: 100, paddingHorizontal: 5 }}>Destination</Text>
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, paddingHorizontal: 5 }}>{location?location:"Noida"}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <TouchableOpacity onPress={() => { router.push('/(tabs)/home/search/setDates') }} style={{
              flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, paddingHorizontal: 5, marginBottom: 10, backgroundColor: '#fff', marginRight: 5
            }}>
              <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: '100', paddingHorizontal: 5 }}>
                Dates
              </Text>
              <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, paddingHorizontal: 5 }}>
                1 Jan- 2 Jan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDatesModal(true); }} style={{
              flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, paddingHorizontal: 5, marginBottom: 10, backgroundColor: '#fff', marginLeft: 5
            }}>
              <Text style={{
                fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: '100', paddingHorizontal: 5
              }}>
                Rooms & Guest
              </Text>
              <Text style={{
                fontFamily: 'Poppins-Medium', fontSize: 14, paddingHorizontal: 5
              }}>
                {rooms} Room - {guests} Guest
              </Text>
            </TouchableOpacity>
          </View>


          <TouchableOpacity onPress={() => { handleHotelSearch(); console.log('go to hotels') }} style={{ backgroundColor: '#ffb000', padding: 15, borderRadius: 5, alignItems: 'center' }} >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Cities */}
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 15, marginTop: 20 }}>Popular Cities</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {popularCities.map((city) => (
            <TouchableOpacity onPress={()=>{
              router.push({
                pathname: "/explore",
                params: { city: city.name },
              });
            }} key={Math.random()} style={{ alignItems: 'center', marginHorizontal: 10 }}>
              <Image source={{ uri: city.image }} style={{ width: 80, height: 80, borderRadius: 50, }} />
              <Text style={{ marginTop: 5, fontSize: 12, fontWeight: 'bold' }}>{city.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 15, marginTop: 10 }}>Hotels Near Me</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {nearByHotels.map((hotel) => (
            <TouchableOpacity onPress={()=>{
              router.push("/(tabs)/explore/booking/searchedHotelDescription");
            }} key={Math.random()} style={{ alignItems: 'center', marginHorizontal: 10 }}>
              <Image source={{ uri: hotel.image }} style={{ width: 80, height: 80, borderRadius: 50, }} />
              <Text style={{ marginTop: 5, fontSize: 12, fontWeight: 'bold' }}>{hotel.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}

        {/* Additional Section: Offers */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 15, marginTop: 20 }}>Exclusive Offers</Text>
        <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
          <View style={{ backgroundColor: '#ffefd5', padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>20% Off on First Booking!</Text>
          </View>
          <View style={{ backgroundColor: '#ffefd5', padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Free Breakfast in Selected Hotels</Text>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={datesModal}
        animationType="slide"
        onRequestClose={()=>setDatesModal(false)}
        onDismiss={()=>setDatesModal(false)}
      
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
              <Text style={{ fontSize: 18, fontFamily: 'Poppins-SemiBold', marginBottom: 20 }}>Select Room & Guests</Text>
              <TouchableOpacity onPress={() => { setDatesModal(false) }}>
                <Entypo name="cross" size={28} color="black" />
              </TouchableOpacity>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontSize: 14, marginRight: 10, fontFamily: 'Poppins-Regular' }}>Number of Guests:</Text>
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

              <Text style={{ fontSize: 14, marginRight: 10, fontFamily: 'Poppins-Regular' }}>Number of Rooms:</Text>
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
