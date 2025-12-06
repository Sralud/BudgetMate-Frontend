// ===== Root Layout =====
// This is the main entry point of the app (like App.js/ts).
// It handles:
// 1. Loading custom fonts (Poppins)
// 2. Showing/Hiding the Splash Screen
// 3. Defining the main navigation container (Stack)

import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load the fonts from the assets/modules
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  // Hide the splash screen once fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Don't render anything until fonts are loaded (prevents glitches)
  if (!fontsLoaded) {
    return null;
  }

  // Render the Stack Navigator (the container for all screens)
  // headerShown: false means we hide the default top bar
  return <Stack screenOptions={{ headerShown: false }} />;
}
