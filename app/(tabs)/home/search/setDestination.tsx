import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setSearchLocation } from '@/redux/reducers/hotelSlice';
import { useInteropClassName } from 'expo-router/build/link/useLinkHooks';

const cities: string[] = [
    'Agartala',
    'Agra',
    'Ahmedabad',
    'Ajmer',
    'Aizawl',
    'Aligarh',
    'Allahabad',
    'Amravati',
    'Amritsar',
    'Aurangabad',
    'Bareilly',
    'Bangalore',
    'Bhilai',
    'Bhiwandi',
    'Bhopal',
    'Bhubaneswar',
    'Bikaner',
    'Bilaspur',
    'Bokaro Steel City',
    'Chandigarh',
    'Chennai',
    'Coimbatore',
    'Cuttack',
    'Darbhanga',
    'Daman',
    'Dehradun',
    'Delhi',
    'Dhanbad',
    'Dispur',
    'Durgapur',
    'Faridabad',
    'Firozabad',
    'Gandhinagar',
    'Gangtok',
    'Ghaziabad',
    'Goa',
    'Gorakhpur',
    'Gulbarga',
    'Guntur',
    'Gurugram',
    'Guwahati',
    'Gwalior',
    'Howrah',
    'Hubli-Dharwad',
    'Hyderabad',
    'Imphal',
    'Indore',
    'Itanagar',
    'Jaipur',
    'Jalandhar',
    'Jammu',
    'Jamshedpur',
    'Jabalpur',
    'Jodhpur',
    'Junagadh',
    'Kalyan-Dombivli',
    'Kanpur',
    'Kavaratti',
    'Kochi',
    'Kolkata',
    'Kolhapur',
    'Kota',
    'Kozhikode',
    'Kurnool',
    'Latur',
    'Lucknow',
    'Ludhiana',
    'Madurai',
    'Malegaon',
    'Malappuram',
    'Mangalore',
    'Meerut',
    'Moradabad',
    'Mumbai',
    'Muzaffarnagar',
    'Mysore',
    'Nadiad',
    'Nagpur',
    'Nanded',
    'Nashik',
    'Navi Mumbai',
    'Noida',
    'Panaji',
    'Panipat',
    'Patna',
    'Porbandar',
    'Puducherry',
    'Pune',
    'Raipur',
    'Rajahmundry',
    'Rajkot',
    'Rampur',
    'Ranchi',
    'Rourkela',
    'Sagar',
    'Salem',
    'Saharanpur',
    'Shimoga',
    'Shillong',
    'Shillong',
    'Shimla',
    'Silvassa',
    'Solapur',
    'Srinagar',
    'Surat',
    'Thane',
    'Thrissur',
    'Tiruchirappalli',
    'Tirunelveli',
    'Tirupati',
    'Tiruppur',
    'Udaipur',
    'Ujjain',
    'Vadodara',
    'Varanasi',
    'Vasai-Virar',
    'Vellore',
    'Vijayawada',
    'Visakhapatnam',
    'Warangal',
];


const SetDestination: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const router = useRouter();
    const dispatch=useDispatch();

    

    const handleSearch = (query: string): void => {
        setSearchQuery(query);
        const filtered = cities.filter((city) =>
            city.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCities(filtered);
    };

    const renderCity = ({ item }: { item: string }) => (
        <TouchableOpacity

            onPress={()=>{
                dispatch(setSearchLocation(item));
                router.back();
            }}
            style={{
                padding: 16,
                backgroundColor: '#fff',
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
            }}
        >
            <Text style={{ fontSize: 16, color: '#333' }}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 16,
                backgroundColor: '#f9f9f9',
            }}
        >
            {/* <ScrollView> */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            marginRight: 8,
                        }}
                        onPress={() => {
                            console.log('Back button pressed');
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
                        Set Your Destination
                    </Text>
                </View>
                <TextInput
                    style={{
                        height: 50,
                        backgroundColor: '#fff',
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: '#ddd',
                        marginBottom: 16,
                    }}
                    placeholder="Search city..."
                    value={searchQuery}
                    onChangeText={(text: string) => handleSearch(text)}
                />
                <FlatList
                //    nestedScrollEnabled={true}
                    data={searchQuery ? filteredCities : cities}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderCity}
                    style={{
                        marginTop: 8,
                    }}
                />
            {/* </ScrollView> */}
        </SafeAreaView>
    );
};

export default SetDestination;
