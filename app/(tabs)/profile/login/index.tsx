import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const index = () => {

    const { width, height } = Dimensions.get('window');
    const [optScreen, setOtpScreen] = useState(false);
    const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
    const [code, setCode] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    const router = useRouter();


    const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
        if (user) {
            // Android devices can automatically process the verification code (OTP) message.
            // Notify the user they have successfully logged in and navigate away if required.
            console.log('userDetails', user);
            Alert.alert('Login Successful', 'You are now logged in.');
            // Add navigation logic here if needed
        }
    };
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);


    const signInWithPhoneNumber = async (phoneNumber: string) => {
        try {

            const number = "+91" + phoneNumber;
            console.log('phoneNumber', number);
            const confirmation = await auth().signInWithPhoneNumber(number);
            console.log('cnfrm', confirmation);
            setConfirm(confirmation);
        } catch (error) {
            console.error('Error signing in with phone number:', error);
            Alert.alert('Error', 'Failed to send verification code. Please try again.');
        }
    };

    const confirmCode = async () => {
        if (!confirm) {
            Alert.alert('Error', 'No confirmation object found.');
            return;
        }

        try {
            const res=await confirm.confirm(code);
            console.log(res);
            Alert.alert('Success', 'Code confirmed, you are now logged in.');
        } catch (error) {
            console.error('Invalid code:', error);
            Alert.alert('Error', 'Invalid verification code. Please try again.');
        }
    };




    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ position: 'absolute', top: 10, left: 10, zIndex: 200 }}><Text style={{ color: '#ffffff', fontFamily: 'Poppins-BlackItalic', fontSize: 30 }}>ICY HOTELS</Text></View>
                <Image source={{ uri: "https://www.pelicanhill.com/images/holiday-cabanajpg.jpg" }} style={{ width: width, height: height * 0.7 }} />
                <View style={{ paddingHorizontal: 25, paddingVertical: 20 }}>
                    <Text style={{ fontSize: 22, textAlign: 'center', color: 'white', fontFamily: 'Poppins-Bold', paddingBottom: 20 }}>Let's Connect Together</Text>


                </View>

            </ScrollView>

            {/* Mobile number card */}
            {!optScreen && <View
                style={{
                    paddingHorizontal: 30,
                    borderTopColor: '#7c7c7c',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderBottomWidth: 0,
                    paddingVertical: 30,
                    shadowColor: 'white', // Shadow color
                    shadowOffset: { width: 3, height: 8 }, // Offset for shadow on top
                    shadowOpacity: 0.8, // Shadow opacity
                    shadowRadius: 6, // Shadow blur radius
                    elevation: 10, // Elevation for Android
                    backgroundColor: '#ffffff', // Ensure background for visibility
                    height: height * 0.35,
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0
                }}
            >
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, marginBottom: 10 }}>Enter Phone Number</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderRadius: 20,
                        borderColor: 'black',
                        paddingHorizontal: 30,
                        alignItems: 'center',
                        gap: 15,
                        marginBottom: 20,
                        paddingVertical: 10
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'black',
                            fontSize: 16,
                            borderRightWidth: 0.5,
                            borderRightColor: 'black',
                            paddingRight: 10,
                        }}
                    >
                        +91
                    </Text>
                    <TextInput
                        keyboardType="phone-pad"
                        placeholder="9856XXXXXX"
                        placeholderTextColor="#7c7c7c"
                        maxLength={10}
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'black',
                            fontSize: 16,
                            justifyContent: 'center',
                            letterSpacing: 1,
                        }}
                        onChangeText={(val: string) => setPhoneNumber(val)}
                    />
                </View>
                <View style={{ paddingHorizontal: 30, flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ height: .5, width: 30, backgroundColor: "#000" }}>

                    </View>
                    <Text style={{ fontSize: 10, textAlign: "center", fontFamily: "Poppins-Light" }}>
                        By continuing, you agree to the <Text style={{ color: "#ffb000" }}>T&C</Text>
                    </Text>
                    <View style={{ height: .5, width: 30, backgroundColor: "#000" }}>

                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        signInWithPhoneNumber(phoneNumber);
                        setOtpScreen(true);
                    }}
                    style={{
                        backgroundColor: '#ffb000',
                        marginTop: 20,
                        borderRadius: 20,
                        shadowColor: "#000",
                        shadowOpacity: .5,
                        shadowOffset: {
                            width: 2,
                            height: 4
                        },
                        shadowRadius: 10,
                        elevation: 6
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Poppins-SemiBold',
                            color: 'white',
                            fontSize: 18,
                            textAlign: 'center',
                            paddingVertical: 8,
                        }}
                    >
                        Request Otp
                    </Text>
                </TouchableOpacity>
            </View>}


            {/* otp filling card */}
            {optScreen && <View
                style={{
                    paddingHorizontal: 30,
                    borderTopColor: '#7c7c7c',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderBottomWidth: 0,
                    paddingVertical: 30,
                    shadowColor: 'white', // Shadow color
                    shadowOffset: { width: 3, height: 8 }, // Offset for shadow on top
                    shadowOpacity: 0.8, // Shadow opacity
                    shadowRadius: 6, // Shadow blur radius
                    elevation: 10, // Elevation for Android
                    backgroundColor: '#ffffff', // Ensure background for visibility
                    height: height * 0.35,
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0
                }}
            >
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, marginBottom: 10 }}>Enter Otp</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderRadius: 20,
                        borderColor: 'black',
                        paddingHorizontal: 30,
                        alignItems: 'center',
                        gap: 15,
                        marginBottom: 20,
                        paddingVertical: 10
                    }}
                >

                    <TextInput
                        keyboardType='numeric'
                        placeholder='XXXXXX'
                        placeholderTextColor="#7c7c7c"
                        maxLength={6}
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'black',
                            fontSize: 16,
                            textAlign: 'center',
                            flex: 1,
                            letterSpacing: 20,
                        }}
                        onChangeText={(val: string) => { setCode(val) }}
                    />
                </View>
                <TouchableOpacity style={{ paddingHorizontal: 10, flexDirection: "row", alignSelf: 'flex-end' }}>

                    <Text style={{ fontSize: 12, fontFamily: "Poppins-SemiBold", color: '#FF8383' }}>
                        Resend Otp
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        // setOtpScreen(true);
                        confirmCode();
                        // router.push('/(tabs)')
                    }}
                    style={{
                        backgroundColor: '#ffb000',
                        marginTop: 20,
                        borderRadius: 20,
                        shadowColor: "#000",
                        shadowOpacity: .5,
                        shadowOffset: {
                            width: 2,
                            height: 4
                        },
                        shadowRadius: 10,
                        elevation: 6
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Poppins-SemiBold',
                            color: 'white',
                            fontSize: 18,
                            textAlign: 'center',
                            paddingVertical: 8,
                        }}
                    >
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>}




        </SafeAreaView>
    )
}

export default index;