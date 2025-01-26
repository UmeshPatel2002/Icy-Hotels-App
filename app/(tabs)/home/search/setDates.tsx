import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
    return new Date(date).toLocaleDateString('en-US', options);
};

const HotelBookingScreen: React.FC = () => {
    const [checkInDate, setCheckInDate] = useState<string | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'checkIn' | 'checkOut'>('checkIn');
    const [markedDates, setMarkedDates] = useState<any>({});
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        setCheckInDate(todayString);
        // setCheckOutDate(todayString);
        setMarkedDates({
            [todayString]: {
                selected: true,
                selectedColor: '#ffb000',
                selectedTextColor: 'white',
            },
        });
    }, []);

    const handleDayPress = (day: any) => {
        const selectedDate = day.dateString;
        const today = new Date().toISOString().split('T')[0];

        if (selectedType === 'checkIn') {
            if (selectedDate < today) {
                setError('Check-in date cannot be before today.');
                return;
            }
            else if (checkOutDate && selectedDate >checkOutDate){
                setError('Check-in date must be before or equal to the check-out date.');
                return;
            }
            setCheckInDate(selectedDate);
            setError(null);

            const updatedMarkedDates: any = {
                [selectedDate]: {
                    selected: true,
                    selectedColor: '#ffb000',
                    selectedTextColor: 'white',
                },
            };

            if (checkOutDate) {
                updatedMarkedDates[checkOutDate] = {
                    selected: true,
                    selectedColor: '#ffb000',
                    selectedTextColor: 'white',
                };
            }

            setMarkedDates(updatedMarkedDates);
        } else if (selectedType === 'checkOut') {
            if (checkInDate && selectedDate < checkInDate) {
                setError('Check-out date must be after or equal to the check-in date.');
                return;
            }
            setCheckOutDate(selectedDate);
            setError(null);

            const updatedMarkedDates:any = {
                [checkInDate]: {
                    selected: true,
                    selectedColor: '#ffb000',
                    selectedTextColor: 'white',
                },
                [selectedDate]: {
                    selected: true,
                    selectedColor: '#ffb000',
                    selectedTextColor: 'white',
                },
            };

            setMarkedDates(updatedMarkedDates);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#f7f7f7' }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
            >
                <TouchableOpacity
                    style={{ marginRight: 8 }}
                    onPress={() => {
                        router.back();
                    }}
                >
                    <AntDesign name="arrowleft" size={24} color="#333" />
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333',
                    }}
                >
                    Select Dates
                </Text>
            </View>

            {error && (
                <View
                    style={{
                        backgroundColor: '#ffe5e5',
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 16,
                    }}
                >
                    <Text style={{ color: '#d9534f', textAlign: 'center' }}>{error}</Text>
                </View>
            )}

            <Calendar
                markedDates={markedDates}
                onDayPress={handleDayPress}
                style={{
                    padding: 15,
                    paddingHorizontal: 30,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    elevation: 3,
                }}
                theme={{
                    todayTextColor: '#ffb000',
                    arrowColor: '#ffb000',
                }}
            />

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    marginVertical: 25,
                    paddingHorizontal: 16,
                }}
            >
                <TouchableOpacity
                    onPress={() => setSelectedType('checkIn')}
                    style={{
                        alignItems: 'center',
                        padding: 15,
                        paddingHorizontal: 30,
                        backgroundColor: selectedType === 'checkIn' ? '#ffb000' : '#fff',
                        borderRadius: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 2,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: selectedType === 'checkIn' ? 'white' : '#555' }}>Check-in</Text>
                    <Text style={{ fontSize: 14, color: selectedType === 'checkIn' ? 'white' : '#333', marginTop: 4 }}>
                        {checkInDate ? formatDate(checkInDate) : 'Not selected'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setSelectedType('checkOut')}
                    style={{
                        alignItems: 'center',
                        padding: 15,
                        paddingHorizontal: 30,
                        backgroundColor: selectedType === 'checkOut' ? '#ffb000' : '#fff',
                        borderRadius: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 2,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: selectedType === 'checkOut' ? 'white' : '#555' }}>Check-out</Text>
                    <Text style={{ fontSize: 14, color: selectedType === 'checkOut' ? 'white' : '#333', marginTop: 4 }}>
                        {checkOutDate ? formatDate(checkOutDate) : 'Not selected'}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={
                    () =>{
                        router.back();

                    }}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 0,
                    right: 0,
                    marginHorizontal: 20,
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        fontFamily: 'Poppins-SemiBold',
                        backgroundColor: '#ffb000',
                        color: 'white',
                        paddingVertical: 10,
                        borderRadius: 16,
                        fontSize: 16,
                    }}
                >
                    Done
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default HotelBookingScreen;
