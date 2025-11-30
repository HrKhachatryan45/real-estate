import { Button } from '@components/ui/Button';
import {Header} from '../../components/Header'
import { useActionState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react-native';
import {AlertMessage} from '../../components/ui/AlertMessage'
import Animated, { FadeInDown } from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet,Image, Text, useColorScheme, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input } from '../../components/ui/Input';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import useResetPassword from '../../hooks/auth/useResetPassword';

export default function resetPassword() {
    const {email} = useLocalSearchParams()
    const [step,setStep] = useState(1)
    const router = useRouter()
    const color = useColorScheme()
    const theme = Colors[color ?? 'light']
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirm,setNewPasswordConfirm] = useState('')
    const [otpCode,setOtpCode] = useState('')
    
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
        iconButton: {
            padding: 10,
            borderRadius: 25,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center'
        }
    })

    const {resetPassword,loading,error,setError} = useResetPassword()

    const handleVerifyCode = async () => {
        // Optional: Verify OTP before going to step 2
        if (!otpCode || otpCode.length !== 6) {
            setError('Please enter a valid 6-digit code')
            return
        }
        setStep(2)
    }

    const [message,setMessage] = useActionState('')
    const handleSubmit = async () => {
        const success = await resetPassword({
            email,
            new_password: newPassword,
            new_password_confirm: newPasswordConfirm,
            otp_code: otpCode
        })
        
        if (success) {
            setMessage(success)
            setTimeout(() => {
                router.push('/login')
            },2000)
        }
    }

    useEffect(() => {
        if(error){
            const timer = setTimeout(() => {
                setError(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    },[error])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={[styles.container,{position:"relative",overflow:'hidden'}]}>
                <Animated.Image
                    entering={FadeInDown.duration(800)}
                    source={require('../../assets/images/lock-login.png')}
                    style={styles.animatedImage1}
                />  
                
                <View style={{width:'90%',justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:theme.text,fontSize:20,fontWeight:'700',marginBottom:10,fontFamily:'roboto-regular'}}>
                        Reset Password
                    </Text>

                    {step === 2 ? (
                        <>
                            <View style={{width: '100%', marginBottom: 20}}>
                                <Header
                                    title={<Text></Text>}
                                    leftIconStyles={{backgroundColor:'transparent',padding:0,borderRadius:50}}
                                    onPress={() => setStep(1)}
                                    icon={
                                        <View style={styles.iconButton}>
                                            <ChevronLeft color={'white'} size={24} />
                                        </View>
                                    }
                                />
                            </View>
                            
                            <Input 
                                placeholder='New Password' 
                                placeholderTextColor={theme.textSecondary} 
                                inputContainerStyle={[styles.input,{marginBottom:10}]}
                                addStyles={styles.addStyles}
                                value={newPassword}
                                secureTextEntry
                                onChangeText={setNewPassword}
                            />

                            <Input 
                                placeholder='Confirm New Password' 
                                placeholderTextColor={theme.textSecondary} 
                                inputContainerStyle={[styles.input,{marginBottom:0}]}
                                addStyles={styles.addStyles}
                                value={newPasswordConfirm}
                                secureTextEntry
                                onChangeText={setNewPasswordConfirm}
                            />
                            
                            <Button 
                                onPress={handleSubmit} 
                                loading={loading} 
                                title='Reset Password' 
                                addStyles={{backgroundColor:theme.primary,width:'100%',marginTop:20}} 
                            />
                            
                            {error && (
                                <Animated.View style={{width:'100%',marginTop:20}} entering={FadeInDown.duration(300)}>
                                    <AlertMessage message={error} type="error" />
                                </Animated.View>
                            )}
                             {message && (
                                <Animated.View style={{width:'100%',marginTop:20}} entering={FadeInDown.duration(300)}>
                                    <AlertMessage message={message} type="success" />
                                </Animated.View>
                            )}
                        </>
                    ) : (
                        <>  
                            <Input 
                                placeholder='6-Digit OTP Code' 
                                placeholderTextColor={theme.textSecondary} 
                                inputContainerStyle={[styles.input,{marginBottom:0}]}
                                addStyles={styles.addStyles}
                                value={otpCode}
                                keyboardType='number-pad'
                                maxLength={6}
                                onChangeText={setOtpCode}
                            />
                            
                            <Button 
                                onPress={handleVerifyCode} 
                                loading={loading} 
                                title='Next' 
                                addStyles={{backgroundColor:theme.primary,width:'100%',marginTop:20}} 
                            />

                            {error && (
                                <Animated.View style={{width:'100%',marginTop:20}} entering={FadeInDown.duration(300)}>
                                    <AlertMessage message={error} type="error" />
                                </Animated.View>
                            )}
                        </>
                    )}
                </View>
                
                <Image
                    source={require('../../assets/images/shield.png')}
                    style={styles.animatedImage2}
                />  
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}