import { View, Text, Image, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'

const {width,height}=Dimensions.get("window")
const index = () => {

    const router = useRouter();
    useEffect(() => {
        setTimeout(() => { router.push('/(tabs)/home') });
    }, []);
    console.log("starting");
    return (
       <View style={{backgroundColor:"#fff",width:width,height:1400}}>

       </View>
    );
}

export default index