import React, { useEffect, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';
import { Animated, TouchableOpacity, View, Text, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const colors = useColorScheme();
  const theme = Colors[colors ?? 'light'];

  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingHorizontal: 10,
        height: 60,
        position:'relative',
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
        }}
      >
        <Svg height="80" width="100%" viewBox="0 0 400 80" preserveAspectRatio='none'>
          <Path
                  d="M 0,20 Q 0,0 20,0 L 135,0 Q 155,0 165,12 Q 182,32 200,32 Q 218,32 235,12 Q 245,0 265,0 L 380,0 Q 400,0 400,20 L 400,40 Q 400,60 380,60 L 20,60 Q 0,60 0,40 Z"
            fill={theme.textSecondary}
          />
        </Svg>
      </View>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel ??
          options.title ??
          route.name.charAt(0).toUpperCase() + route.name.slice(1);

        const isFocused = state.index === index;

        const widthAnim = useRef(new Animated.Value(isFocused ? 110 : 60)).current;

        useEffect(() => {
          Animated.spring(widthAnim, {
            toValue: isFocused ? 110 : 60,
            useNativeDriver: false,
          }).start();
        }, [isFocused]);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };


        

        return (
          <View key={route.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={{ marginHorizontal: 5 }}
            >
              <Animated.View
                style={{
                  width: 60,
                  height: 50,
                  borderRadius: 50,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                  <LinearGradient
                    colors={isFocused ? [theme.primaryLight, theme.primaryDark] : [theme.backgroundTertiary, theme.backgroundTertiary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 50,
                    }}
                  >
                    <IconSymbol name={options.icon} size={20} color={theme.textMuted} />
                  </LinearGradient>
              
              </Animated.View>
            </TouchableOpacity>
              {index == 1 && <View
              key={state.routes?.length + 1}
                  style={{     
                width: 50,
                height: 50,
                marginTop: -50,
                borderRadius: 50,
                overflow: 'hidden',
                backgroundColor: theme.primary,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
                >
                  <IconSymbol name="plus" size={24} color="white" />
                </View>}
            </View>
        );

      })}
    </View>
  );
}

export default function TabLayout() {
  const router = useRouter()


  const colorScheme : String = useColorScheme()
  const theme = Colors[colorScheme ?? 'light'];
  return (
     <View style={{
      flex: 1,
      backgroundColor:'transparent',

    }}>
    <Tabs screenOptions={{headerShown:false}} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          icon: 'house.fill',
          headerShown: false,
          // tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          icon: 'magnifyingglass',
          headerShown: false,
          // tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          icon: 'bubble.left.and.bubble.right.fill',
          headerShown: false,
          // tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          icon: 'person.fill',
          headerShown: false,
          // tabBarButton: HapticTab,
        }}
      />
    </Tabs>
    </View>
  );
}
