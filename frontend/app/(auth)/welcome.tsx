import { StyleSheet,Image, Text, View,SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { Button } from '@/components/ui/Button';
import Animated , {FadeInDown} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Welcome() {
    const router = useRouter();
    const color = useColorScheme()
     
    const theme = Colors[color ?? 'light'];


     const [ready, setReady] = useState(false);

  useEffect(() => {
    async function load() {
      await Asset.loadAsync([
        require('../../assets/images/house-logo.png'),
        require('../../assets/images/welcome-building.png'),
        require('../../assets/images/sack-dollar.png')
      ]);

      setReady(true);
    }
    load();
  }, []);
  const user = useSelector((state) => state?.auth?.user)|| {};


useEffect(() => {
    if(Object.keys(user)?.length > 0) {
        router.replace('/(tabs)/')
    }
  },[user])

  if (!ready) return null; // or splash loader





  return (
    <SafeAreaView style={styles.container}> 
    <Animated.Image
        entering={FadeInDown.duration(800)}
        source={require('../../assets/images/house-logo.png')}
        style={{width:300,height:300,resizeMode:'contain',position:'absolute',top:0,left:-150}}
    />  
       <View style={{width:'90%',justifyContent:'center',alignItems:'center',position:'relative',flex:1}}>
        <Pressable style={{position:'absolute',top:40,right:0}} onPress={()=>router.replace('/signin')}>
        <Text style={{textDecorationLine:'underline',color:theme.text}}>Sign In</Text>
        </Pressable>
         <View style={{marginBottom:-60}}>
            <Text style={[styles.text,{color:theme.text}]}>Welcome to Real Estate App</Text>
            <Text style={[styles.subtitle, {color: theme.textSecondary}]}>
                Find your dream home in minutes.
            </Text>
        </View>
      
        <Animated.Image
            entering={FadeInDown.duration(800)}
            source={require('../../assets/images/welcome-building.png')}
            style={styles.image}
        />
       

        <Animated.View
            entering={FadeInDown.duration(800)}
            style={{width:'100%',marginBottom:50,position:'absolute',bottom:0}}
        >
            <Button title='Get Started' onPress={() => router.replace('/signup')} fullWidth addStyles={{backgroundColor:theme.primary,height:50}}/>

        </Animated.View>
       </View>
    <Animated.Image
        entering={FadeInDown.duration(800)}
        source={require('../../assets/images/sack-dollar.png')}
        style={{width:300,height:300,resizeMode:'contain',position:'absolute',bottom:30,zIndex:-20,right:-150}}
    />  
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'start',
        alignItems:'center',
    },
    subtitle:{
    },
    image:{
        width:400,
        height:500,
        resizeMode:'contain'
    },
    text:{
        fontSize:34,
        fontWeight:'bold',
        fontFamily:'bebas-regular',

    }
})