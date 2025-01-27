import { View, Text, Image, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const {width,height}=Dimensions.get("window")
const index = () => {

    const router = useRouter();
    useEffect(() => {
        setTimeout(() => { router.push('/(tabs)/home') });
    }, []);

    return (
       <View style={{backgroundColor:"#fff",width:width,height:1400}}>

       </View>
    );
}

export default index