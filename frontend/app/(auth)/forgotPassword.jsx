import { Button } from '@components/ui/Button';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect } from 'react';
import {Header} from '../../components/Header'
import {AlertMessage} from '../../components/ui/AlertMessage'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';
import { SafeAreaView, StyleSheet,Image, Text, useColorScheme, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input } from '../../components/ui/Input';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import useForgetPassword from '../../hooks/auth/useForgotPassword';
import { usePathname,useSegments } from 'expo-router';
export default function signin() {
 
    const router = useRouter()
    const color = useColorScheme()
    const theme = Colors[color ?? 'light']
    const [email, setEmail] = useState('')

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
    },
    iconButton:{
        padding:10,
        borderRadius:50,
        backgroundColor:theme.primary
    }
    })

    const {forgetPassword,loading,error,setError} = useForgetPassword()

useEffect(() => {
    if(error){
        setTimeout(() => {
            setError(null)
        },3000)
    }
},[error])

const user = useSelector((state) => state.auth?.user)


const [message,setMessage] = useState('')

const handleSubmit = async () => {
    const json =await forgetPassword(email)
    setMessage(json)
}

useEffect(() => {
    if (message){
        router.replace({
            pathname:'resetPassword',
            params:{'email':email}
        })
    }
},[message])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[styles.container,{position:"relative",overflow:'hidden'}]}>
        <Animated.Image
            entering={FadeInDown.duration(800)}
            source={require('../../assets/images/lock-login.png')}
            style={styles.animatedImage1}
        />  
        <View style={{width:'90%',justifyContent:'center', alignItems:'center'}}>
             <Header
                leftIconStyles={{backgroundColor:'transparent',padding:0,borderRadius:50}}
                onPress={() => router.back()}
                icon={
                    <View style={[styles.iconButton]} >
                        <ChevronLeft color={'white'} size={24} />
                    </View>
                }
            />
            <Text style={{color:theme.text,fontSize:20,fontWeight:700,marginBottom:10,fontFamily:'roboto-regular'}}>Forgot Password?</Text>
            <Input 
                placeholder="E-mail"
                placeholderTextColor={theme.textSecondary}
                value={email}
                keyboardType="email-address"
                onChangeText={setEmail}
                inputContainerStyle={styles.input}
                addStyles={styles.addStyles}
            />

            {error && (
                <Animated.View style={{width:'100%',marginTop:20}} entering={FadeInDown.duration(300)} >
                    <AlertMessage message={error} type="error" />
                </Animated.View>
            )}

            {message && (
                <Animated.View style={{width:'100%',marginTop:20}} entering={FadeInDown.duration(300)} >
                    <AlertMessage message={message} type="success" />
                </Animated.View>
            )}

            <Button onPress={handleSubmit} loading={loading} title='Send Code' addStyles={{backgroundColor:theme.primary,width:'100%',marginTop:20}} />
            
        </View>
        <Image
            source={require('../../assets/images/shield.png')}
            style={styles.animatedImage2}
        />  
    </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
