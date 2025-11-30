import { StyleSheet, Text, useColorScheme, View,Image } from 'react-native'
import React, { useEffect } from 'react'
import Colors from '@/constants/Colors'
import { useRouter } from 'expo-router';

export default function index() {

    const color = useColorScheme()

    const theme = Colors[color ?? 'light'];
    const router = useRouter();
    
    useEffect(() => {
        setTimeout(() => {
            router.replace('/welcome')
        },2000)
    },[])

  return (
    <View style={[styles.container,{backgroundColor: theme.background}]}>
        <Image
            source={require('../assets/images/splash-screen.png')}
            style={styles.image}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width:200,
        height:200,
        resizeMode:'contain'
    }
})