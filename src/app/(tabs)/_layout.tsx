import { Redirect, Tabs, router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

import { Box } from "@/components/authorable/Box";
import Gradient from "@/components/authorable/Gradient";
import { NotificationDot } from "@/components/authorable/NotificationDot";
import { IconStroke } from "@/constants/Common";
import { useAuth } from "@/services/AuthContext";
import {
  InvitationProvider,
  useInvitations,
} from "@/services/InvitationContext";
import theme from "@/theme";
import { Bubbles, Home, Plus, Send, User } from "lucide-react-native";

function TabLayoutContent() {
  const { pendingInvitationsCount } = useInvitations();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          marginHorizontal: theme.spacing.l,
          marginBottom: theme.spacing.l,
          backgroundColor: theme.colors.gray900,
          borderRadius: theme.borderRadii.xxl,
          height: 64,
          paddingTop: 0,
          paddingBottom: 0,
          borderTopWidth: 0,
          shadowColor: theme.colors.gray800,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 12,
        },
        tabBarItemStyle: {
          height: 64,
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            {...(props as any)}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.white,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="circles"
        options={{
          title: "Círculos",
          tabBarIcon: ({ color, size }) => (
            <Bubbles size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-circle"
        options={{
          title: "",
          tabBarIcon: () => (
            <TouchableOpacity
              onPress={() => router.push("/circle/create")}
              style={{
                width: 70,
                height: 70,
                borderRadius: 40,
                marginBottom: 50,
                shadowColor: theme.colors.gray800,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Gradient
                colors={[
                  theme.colors.linearGradientPrimary2,
                  theme.colors.linearGradientPrimary3,
                  theme.colors.linearGradientPrimary1,
                ]}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 4,
                  borderColor: theme.colors.white,
                }}
              >
                <Plus
                  size={30}
                  color={theme.colors.white}
                  strokeWidth={IconStroke}
                />
              </Gradient>
            </TouchableOpacity>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as any)}
              onPress={() => router.push("/circle/create")}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="invitations"
        options={{
          title: "Invitación",
          tabBarIcon: ({ color, size }) => (
            <Box position="relative">
              <Send size={size} color={color} strokeWidth={2} />
              {pendingInvitationsCount > 0 && (
                <NotificationDot size="m" color="error" />
              )}
            </Box>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <InvitationProvider>
      <TabLayoutContent />
    </InvitationProvider>
  );
}
