import {Dimensions, StyleSheet, Text, Image, View, useColorScheme, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { Search, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Animated } from 'react-native';

export default function Navbar({expanded,setExpanded}:any) {
  const color = useColorScheme();
  const theme = Colors[color ?? 'light'];
  const router = useRouter();

  const widthAnim = React.useRef(new Animated.Value(45)).current;
  const screenWidth = Dimensions.get('window').width;

  const handleToggleSearch = () => {
    let newValue = !expanded;
    setExpanded(newValue);

    Animated.timing(widthAnim, {
      toValue: newValue ? screenWidth - 150 : 45, // expand or collapse
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const [searchQuery, setSearchQuery] = useState('');
  


  return (
    <View
      style={{
        height: 60,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/images/logo-2d.png")}
        style={{ width: 60, height: 60, resizeMode: "contain" }}
      />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        
        <Animated.View
          style={{
            width: widthAnim ,
            height: 45,
            backgroundColor: theme.textSecondary,
            borderRadius: 50,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={handleToggleSearch}>
            <Search color={"white"} size={20} />
          </TouchableOpacity>

          {expanded && (
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#ccc"
              onChangeText={setSearchQuery}
              onSubmitEditing={()=> {
                router.push({
                  pathname:'/search',
                  params:{query:searchQuery}
                })
              }}
              style={{
                color: "white",
                marginLeft: 10,
                flex: 1,
                fontSize: 16,
              }}
            />
          )}
        </Animated.View>

        <TouchableOpacity
          onPress={() => router.replace("/settings")}
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.textSecondary,
          }}
        >
          <Settings color={"white"} size={20} />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
