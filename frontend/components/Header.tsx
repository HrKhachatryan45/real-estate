import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { StyleProp,ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/Colors';

export  function Header({
    icon,
    title,
    addStyles,
    onPress,
    leftIconStyles
}:{
    icon: React.ReactNode,
    title: string,
    addStyles:StyleProp<ViewStyle>,
    onPress?: ()=> void,
    leftIconStyles?:StyleProp<ViewStyle>
}) {
    const colors = useColorScheme();
    const theme = Colors[colors ?? 'light'];

  return (
    <View style={[styles.header,addStyles]}>
        <TouchableOpacity onPress={onPress} style={[{padding:10,backgroundColor:theme.primary,borderRadius:'50%'}, leftIconStyles]}>
            {icon}
        </TouchableOpacity>
        {title}
    </View>
  )
}

const styles = StyleSheet.create({
    header:{
        marginBottom:15,
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        gap:10
    }
})