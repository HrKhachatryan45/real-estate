import { useFonts } from 'expo-font';

export function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    'bebas-regular': require('../../assets/fonts/BebasNeue-Regular.ttf'),
    'roboto-regular': require('../../assets/fonts/Roboto-VariableFont_wdth,wght.ttf'),
  });
  return fontsLoaded;
}
