import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../redux/stores/store'
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { restoreUser } from '../redux/slices/authSlice';
import { SplashScreen } from 'expo-router';
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const dispatch = useDispatch()
  useEffect(() => {
    const restoreUserFromStorage = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const access_token = await AsyncStorage.getItem('token')
        
        if (userData) {
          console.log('restoring user from storage', userData, access_token);
          const user = JSON.parse(userData);
          dispatch(restoreUser({user,access_token}));
        }
      } catch (error) {
        console.error('Failed to restore user from storage:', error);
      }
    };

    restoreUserFromStorage();
  }, []);

  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="property" options={{ headerShown: false }} />
        <Stack.Screen name="conversations" options={{ headerShown: false }} />
        <Stack.Screen name="map" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      // simulate app loading 2s (auth, fetch config, fonts, etc.)
      await new Promise(r => setTimeout(r, 2000));
      setReady(true);
      SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  // useEffect(() => {
      // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  // }, []);

    

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <AppContent />
      </Provider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}