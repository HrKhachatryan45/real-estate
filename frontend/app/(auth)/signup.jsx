import { Header } from '@components/Header';
import { AlertMessage } from '@components/ui/AlertMessage';
import { Button } from '@components/ui/Button';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Keyboard, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Input } from '../../components/ui/Input';
import Colors from '../../constants/Colors';
import useRegister from '../../hooks/auth/useRegister';

export default function signup() {
    const color = useColorScheme()
    const theme = Colors[color ?? 'light']
    const [userData,setUserData] = useState({
        fullName:'',
        email:'',
        password:'',
        phone:'',
        city:''
    })


    const styles = StyleSheet.create({
        container:{
            overflow:'hidden',
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

    const {error,register,loading,setError} = useRegister()

    const handleRegister = async () => {
        if(userData.password === '' || userData.phone === '' || userData.city === ''){
            setError('Please fill all the fields')
            return
        }
        await register(userData)
    }

    const handleAppleLogin = async () => {
        // Handle Apple login logic here
    }

    const handleGoogleLogin = async () => {
        // Handle Google login logic here
    }
    const [step,setStep] = useState(1)

    const handleNextStep = () => {
        if(userData.fullName === '' || userData.email === ''){
            setError('Please fill all the fields')
            return
        }
        setStep(2)
    }

    useEffect(() => {
        if(error){
            setTimeout(() => {
                setError(null)
            },3000)
        }
    },[error])

    
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[styles.container,{position:"relative"}]}>
            <Animated.Image
                    entering={FadeInDown.duration(800)}
                    source={require('../../assets/images/lock-login.png')}
                    style={styles.animatedImage1}
            />  
            {step === 1 && (
                <View style={{width:'90%',justifyContent:'center', alignItems:'center'}}>

                    <Text style={{color:theme.text,fontSize:22,marginBottom:10,fontWeight:500}}>Let's get started</Text>

                    <Input 
                        placeholder="Full Name"
                        placeholderTextColor={theme.textSecondary}
                        value={userData.fullName}
                        onChangeText={(text) => setUserData({...userData,fullName:text})}
                        inputContainerStyle={styles.input}
                        addStyles={styles.addStyles}
                    />

                    <Input 
                        placeholder="E-mail"
                        placeholderTextColor={theme.textSecondary}
                        value={userData.email}
                        keyboardType="email-address"
                        onChangeText={(text) => setUserData({...userData,email:text})}
                        inputContainerStyle={styles.input}
                        addStyles={styles.addStyles}
                    />


                    {error && (
                        <Animated.View style={{width:'100%'}} entering={FadeInDown.duration(300)} >
                            <AlertMessage message={error} type="error" />
                        </Animated.View>
                    )}

                    <Button onPress={handleNextStep}  title='Next Step' addStyles={{backgroundColor:theme.primary,width:'100%',marginTop:20}}/>
                    
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:10,justifyContent:'center',gap:5}}>
                        <Text style={{color:theme.text}}>Already have an account?</Text>
                        <Link href={'/signin'} style={{color:theme.primary,textDecorationLine:'underline'}}>Sign In</Link>
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
            )}
            {step === 2 && (
                <View style={{width:'90%',justifyContent:'center', alignItems:'center'}}>
                <Header onPress={() => {
                    setTimeout(() => {
                        setStep(1)
                    },400)
                }} icon={<ChevronLeft color={theme.text} size={25}/>}
                 title={<Text style={{fontSize:15,color:theme.text}}>One more step</Text>} />
                <Input 
                    placeholder="Phone Number"
                    placeholderTextColor={theme.textSecondary}
                    value={userData.phone}
                    onChangeText={(text) => setUserData({...userData,phone:text})}
                    inputContainerStyle={styles.input}
                    addStyles={styles.addStyles}
                />
        
                <Input 
                    placeholder="City"
                    placeholderTextColor={theme.textSecondary}
                    value={userData.city}
                    onChangeText={(text) => setUserData({...userData,city:text})}
                    inputContainerStyle={styles.input}
                    addStyles={styles.addStyles}
                />
        

                <Input 
                    placeholder='Password' 
                    placeholderTextColor={theme.textSecondary} 
                    inputContainerStyle={[styles.input,{marginBottom:0}]}
                    addStyles={styles.addStyles}
                    value={userData.password}
                    secureTextEntry
                    keyboardType='email-address'
                    onChangeText={(text) => setUserData({...userData,password:text})}
                />

                
                {error && (
                    <Animated.View style={{width:'100%'}} entering={FadeInDown.duration(300)} >
                        <AlertMessage message={error} type="error" />
                    </Animated.View>
                )}

                <Button onPress={handleRegister}  title='Sign Up' addStyles={{backgroundColor:theme.primary,width:'100%',marginTop:20}}/>
                
                </View>
            )}
            <Image
                source={require('../../assets/images/shield.png')}
                style={styles.animatedImage2}
            />  
        </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

