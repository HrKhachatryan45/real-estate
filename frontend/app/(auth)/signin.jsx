import { Button } from '@components/ui/Button';
import { useEffect } from 'react';
import {AlertMessage} from '../../components/ui/AlertMessage'
import Animated, { FadeInDown } from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet,Image, Text, useColorScheme, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input } from '../../components/ui/Input';
import Colors from '../../constants/Colors';
import useLogin from '../../hooks/auth/useLogin';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

export default function signin() {

    const router = useRouter()
    const color = useColorScheme()
    const theme = Colors[color ?? 'light']
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    input:{
        width: '100%',
        height: 45,
        borderRadius: 10,
        borderColor: theme.textSecondary,
        backgroundColor: theme.background,           
    },
    addStyles:{
        color: theme.text, 
        fontSize: 14,     
    },
    animatedImage2:{
        width:300,
        height:300,
        transform: [{ rotate:'-50deg' }],
        resizeMode:'contain',
        position:'absolute',
        bottom:-90,
        zIndex:-50,
        right:-120
    },
    animatedImage1:{
        width:300,
        height:300,
        resizeMode:'contain',
        position:'absolute',
        top:0,
        left:-120
    }
})

const {error,login,loading,setError} = useLogin()

const handleLogin = async () => {
    await login(email,password)
    // router.replace('/(tabs)/')
}

const handleAppleLogin = async () => {
    // Handle Apple login logic here
}

const handleGoogleLogin = async () => {
    // Handle Google login logic here
}


useEffect(() => {
    if(error){
        setTimeout(() => {
            setError(null)
        },3000)
    }
},[error])

const user = useSelector((state) => state.auth?.user)

useEffect(() =>{
    if(user){
        router.replace('/(tabs)/')
    }
},[user])


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[styles.container,{position:"relative",overflow:'hidden'}]}>
        <Animated.Image
            entering={FadeInDown.duration(800)}
            source={require('../../assets/images/lock-login.png')}
            style={styles.animatedImage1}
        />  
        <View style={{width:'90%',justifyContent:'center', alignItems:'center'}}>
            <Text style={{color:theme.text,fontSize:20,fontWeight:700,marginBottom:10,fontFamily:'roboto-regular'}}>Sign In</Text>
           <Input 
                placeholder="E-mail"
                placeholderTextColor={theme.textSecondary}
                value={email}
                keyboardType="email-address"
                onChangeText={setEmail}
                inputContainerStyle={styles.input}
                addStyles={styles.addStyles}
            />

            <Input 
                placeholder='Password' 
                placeholderTextColor={theme.textSecondary} 
                inputContainerStyle={[styles.input,{marginBottom:0}]}
                addStyles={styles.addStyles}
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />

            <View style={{width:'100%',alignItems:'flex-end',marginVertical:-10,justifyContent:'flex-end',gap:5}}>
                <Text onPress={() => router.replace('/forgotPassword')} style={{color:theme.primary,textAlign:'right'}}>Forgot Password?</Text>
            </View>
            {error && (
                <Animated.View style={{width:'100%',marginTop:20}} entering={FadeInDown.duration(300)} >
                    <AlertMessage message={error} type="error" />
                </Animated.View>
            )}
            <Button onPress={handleLogin} loading={loading} title='Sign In' addStyles={{backgroundColor:theme.primary,width:'100%',marginTop:20}} />
            
            <View style={{flexDirection:'row',alignItems:'center',marginTop:10,justifyContent:'center',gap:5}}>
                <Text style={{color:theme.text}}>Don't have an account yet?</Text>
                <Link href={'/signup'} style={{color:theme.primary,textDecorationLine:'underline'}}>Sign Up</Link>
            </View>
            <View style={{flex:1,justifyContent:'between',flexDirection:'row',marginTop:10,gap:10}}>
                <Button onPress={handleGoogleLogin} addStyles={{backgroundColor:theme.background,height:50,width:'48%'}}>
                    <AntDesign name="google" size={24} color={theme.text} />
                </Button>
                <Button onPress={handleAppleLogin} addStyles={{backgroundColor:theme.background,height:50,width:'48%'}}>
                    <AntDesign name="apple" size={24} color={theme.text} />
                </Button>
            </View>
        </View>
        <Image
            source={require('../../assets/images/shield.png')}
            style={styles.animatedImage2}
        />  
    </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

