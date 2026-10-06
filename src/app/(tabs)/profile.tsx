import { AlertDialog, Rate } from "@/components/authorable";
import { Avatar } from "@/components/authorable/Avatar";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import { Card } from "@/components/authorable/Card";
import { Header } from "@/components/authorable/Header";
import { LoadingSpinner } from "@/components/authorable/LoadingSpinner";
import { Text } from "@/components/authorable/Text";
import { AppName, TAB_BAR_CLEARANCE } from "@/constants/Common";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { formatDate } from "@/utils/common";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import {
  Calendar,
  ChevronRight,
  Edit3,
  HelpCircle,
  LogOut,
  Mail,
  PiggyBank,
  ShieldHalf,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const theme = useTheme<Theme>();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setIsLoading(true);
    setShowLogoutDialog(false);
    await logout();
    setIsLoading(false);
    router.replace("/(auth)/sign-in");
  };

  const handleNavigateToFAQ = () => {
    router.push("/faq");
  };

  const menuItems = [
    {
      icon: <User size={20} color={theme.colors.textSecondary} />,
      title: "Edit Profile",
      onPress: handleEditProfile,
    },
    {
      icon: <PiggyBank size={20} color={theme.colors.textSecondary} />,
      title: "Numeros de cuenta",
      onPress: () => router.push("/account-numbers"),
    },
    {
      icon: <HelpCircle size={20} color={theme.colors.textSecondary} />,
      title: "Preguntas frecuentes",
      onPress: handleNavigateToFAQ,
    },
    /* {
      icon: <Settings size={20} color={theme.colors.textSecondary} />,
      title: "Settings",
      onPress: () => console.log("Settings"),
    },
    {
      icon: <HelpCircle size={20} color={theme.colors.textSecondary} />,
      title: "Help & Support",
      onPress: () => console.log("Help"),
    },
    {
      icon: <Shield size={20} color={theme.colors.textSecondary} />,
      title: "Privacy Policy",
      onPress: () => console.log("Privacy"),
    }, */
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cerrando tu sesión..." />;
  }

  return (
    <Box flex={1} backgroundColor="background">
      <Header
        avatarUrl={user?.avatarUrl}
        firstName={user?.firstName}
        lastName={user?.lastName}
        borderBottom={false}
        backgroundColor="gray900"
      />

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.l,
          paddingBottom: TAB_BAR_CLEARANCE,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* User info — visually merged with the primary header */}

        <Box
          alignItems="center"
          paddingHorizontal="l"
          paddingBottom="l"
          paddingTop="l"
        >
          <Box borderRadius="round" borderWidth={2} borderColor="primary">
            <Avatar
              size="extralarge"
              uri={user?.avatarUrl}
              firstName={user?.firstName}
              lastName={user?.lastName}
              backgroundColor="white"
            />
          </Box>
          <Text
            variant="subtitle"
            marginTop="m"
            style={{ color: theme.colors.gray900 }}
          >
            {user?.firstName} {user?.lastName}
          </Text>
          <Text variant="body" marginTop="xs" marginBottom="l">
            {user?.email}
          </Text>

          <Button
            title="Editar perfil"
            variant="primary"
            size="large"
            onPress={handleEditProfile}
            icon={<Edit3 size={16} color={theme.colors.gray900} />}
          />
        </Box>

        {/* Account Details */}
        <Text
          variant="bodyBold"
          color="text"
          fontSize={18}
          marginTop="l"
          marginBottom="m"
        >
          Tu cuenta
        </Text>
        <Card padding="l" marginBottom="l">
          <Box gap="m">
            <Box flexDirection="row" alignItems="center">
              <Mail size={20} color={theme.colors.textSecondary} />
              <Box flex={1} marginLeft="m">
                <Text variant="body" color="textSecondary">
                  Email
                </Text>
                <Text variant="bodyBold" color="text">
                  {user?.email}
                </Text>
              </Box>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Calendar size={20} color={theme.colors.textSecondary} />
              <Box flex={1} marginLeft="m">
                <Text variant="body" color="textSecondary">
                  Miembro desde
                </Text>
                <Text variant="bodyBold" color="text">
                  {formatDate(new Date(user?.createdAt || ""), {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </Box>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <ShieldHalf size={20} color={theme.colors.textSecondary} />
              <Box flex={1} marginLeft="m">
                <Text variant="body" color="textSecondary">
                  Calificación
                </Text>
                <Box flexDirection="row" alignItems="center" gap="s">
                  <Rate
                    score={user?.averageRating ?? 0}
                    size={18}
                    color={theme.colors.primary}
                    unfilledColor={theme.colors.gray300}
                  />
                  <Text variant="bodyBold" color="text">
                    {user?.averageRating?.toFixed(1) ?? "0.0"}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    ({user?.totalRatings ?? 0}{" "}
                    {user?.totalRatings === 1 ? "reseña" : "reseñas"})
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Menu Items */}
        <Text variant="bodyBold" color="text" fontSize={18} marginBottom="m">
          Acciones
        </Text>

        <Card padding="l" marginBottom="l">
          <Box gap="s">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: theme.spacing.s,
                  paddingHorizontal: theme.spacing.s,
                  borderRadius: theme.borderRadii.s,
                }}
                activeOpacity={0.7}
              >
                {item.icon}
                <Text
                  variant="body"
                  color="text"
                  style={{ flex: 1 }}
                  marginLeft="m"
                >
                  {item.title}
                </Text>
                <ChevronRight size={16} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </Box>
        </Card>

        {/* Logout */}
        <Box marginTop="l">
          <Button
            title="Cerrar sesión"
            variant="primary"
            onPress={handleLogout}
            icon={<LogOut color={theme.colors.gray900} />}
            size="large"
          />
        </Box>

        {/* Version Info */}
        <Box alignItems="center" marginTop="l" marginBottom="l">
          <Text variant="caption" color="textTertiary">
            {AppName} Circle Savings App
          </Text>
          <Text variant="caption" color="textTertiary" marginTop="xs">
            Version 1.0.0
          </Text>
        </Box>
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        visible={showLogoutDialog}
        title="Cerrar sesión"
        description="¿Estás seguro de que quieres cerrar sesión?"
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        confirmText="Cerrar"
        cancelText="Cancelar"
        variant="warning"
        confirmButtonVariant="outlineError"
        cancelButtonVariant="outlineGray"
      />
    </Box>
  );
}
