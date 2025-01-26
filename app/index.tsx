import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const index = () => {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => { router.push('/(tabs)/home') });
    }, [])

    return (
        <SafeAreaView>
            {/* <Text>index</Text> */}
            {/* <Image source={require('../assets/images/splash.png')} /> */}
        </SafeAreaView>
    )
}

export default index