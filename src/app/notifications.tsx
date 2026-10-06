import ActivityList from "@/components/authorable/ActivityList";
import { Box } from "@/components/authorable/Box";
import { EmptyState } from "@/components/authorable/EmptyState";
import Sleepy from "@/components/authorable/pig/Sleepy";
import { Text } from "@/components/authorable/Text";
import { Theme } from "@/theme";
import { FeedItem } from "@/types/api";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";

const notifications: FeedItem[] = [];

export default function NotificationsScreen() {
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} backgroundColor="background">
      <Box
        backgroundColor="white"
        paddingHorizontal="l"
        paddingTop="xxl"
        paddingBottom="l"
        shadowColor="gray800"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={2}
      >
        <Box flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Box flex={1} marginLeft="m">
            <Text variant="titleBold" color="text">
              Notificaciones
            </Text>
          </Box>
        </Box>
      </Box>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.l, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <EmptyState
            title="Sin notificaciones"
            description="Cuando haya actividad en tus círculos, aparecerá aquí."
            icon={<Sleepy />}
          />
        ) : (
          <ActivityList items={notifications} />
        )}
      </ScrollView>
    </Box>
  );
}
