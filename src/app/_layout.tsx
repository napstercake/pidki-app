import Gradient from "@/components/authorable/Gradient";
import { AuthProvider } from "@/services/AuthContext";
import theme from "@/theme";
import { ThemeProvider } from "@shopify/restyle";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image } from "react-native";
import "react-native-reanimated";
//import { OneSignal } from "react-native-onesignal";

//OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!);
//OneSignal.Notifications.requestPermission(true);

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [loaded] = useFonts({
    PlusJakartaSans: require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-Italic": require("../../assets/fonts/PlusJakartaSans-Italic.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return (
      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary3,
          theme.colors.linearGradientPrimary2,
        ]}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Image
          source={require("../../assets/images/logo-loading.png")}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
      </Gradient>
    );
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="circle/[id]" options={{ headerShown: false }} />
            <Stack.Screen
              name="invitation/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="faq" options={{ headerShown: false }} />
            <Stack.Screen name="contact" options={{ headerShown: false }} />
            <Stack.Screen
              name="privacy-policy"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="terms" options={{ headerShown: false }} />
            <Stack.Screen name="about" options={{ headerShown: false }} />
            <Stack.Screen name="developer" options={{ headerShown: false }} />
            <Stack.Screen
              name="notifications"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
