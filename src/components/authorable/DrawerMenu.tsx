import { AppName } from "@/constants/Common";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import {
  BookOpen,
  Building2,
  ChevronRight,
  HelpCircle,
  Info,
  LogOut,
  MessageSquare,
  Shield,
  X,
} from "lucide-react-native";
import React from "react";
import { Modal, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "./Box";
import { Text } from "./Text";

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ visible, onClose }) => {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleNavigate = (path: string) => {
    onClose();
    setTimeout(() => router.push(path as any), 200);
  };

  const handleLogout = async () => {
    onClose();
    setTimeout(async () => {
      await logout();
      router.replace("/(auth)/sign-in");
    }, 200);
  };

  const menuSections: { title?: string; items: MenuItem[] }[] = [
    {
      title: "Soporte",
      items: [
        {
          icon: <HelpCircle size={20} color={theme.colors.textSecondary} />,
          label: "Preguntas frecuentes",
          onPress: () => handleNavigate("/faq"),
        },
        {
          icon: <MessageSquare size={20} color={theme.colors.textSecondary} />,
          label: "Contáctanos",
          onPress: () => handleNavigate("/contact"),
        },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          icon: <Shield size={20} color={theme.colors.textSecondary} />,
          label: "Política de privacidad",
          onPress: () => handleNavigate("/privacy-policy"),
        },
        {
          icon: <BookOpen size={20} color={theme.colors.textSecondary} />,
          label: "Términos y condiciones",
          onPress: () => handleNavigate("/terms"),
        },
      ],
    },
    {
      title: "Acerca de",
      items: [
        {
          icon: <Info size={20} color={theme.colors.textSecondary} />,
          label: `Sobre ${AppName}`,
          onPress: () => handleNavigate("/about"),
        },
        {
          icon: <Building2 size={20} color={theme.colors.textSecondary} />,
          label: "HeadboxStudio",
          onPress: () => handleNavigate("/developer"),
        },
      ],
    },
    {
      items: [
        {
          icon: <LogOut size={20} color={theme.colors.error} />,
          label: "Cerrar sesión",
          onPress: handleLogout,
          destructive: true,
        },
      ],
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Drawer panel — stop propagation so taps inside don't close */}
        <TouchableOpacity
          activeOpacity={1}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "80%",
            backgroundColor: theme.colors.white,
            paddingTop: insets.top,
            paddingBottom: insets.bottom + theme.spacing.l,
            shadowColor: theme.colors.gray900,
            shadowOffset: { width: 4, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 16,
          }}
        >
          {/* Header */}
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal="l"
            paddingVertical="m"
            borderBottomWidth={1}
            borderBottomColor="border"
            marginBottom="s"
          >
            <Box>
              <Text
                variant="subtitle"
                color="text"
                style={{ fontWeight: "700" }}
              >
                {AppName}
              </Text>
            </Box>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: theme.colors.gray100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} color={theme.colors.text} />
            </TouchableOpacity>
          </Box>

          <ScrollView showsVerticalScrollIndicator={false}>
            {menuSections.map((section, sectionIndex) => (
              <Box key={sectionIndex} marginBottom="s">
                {section.title && (
                  <Text
                    variant="caption"
                    color="textTertiary"
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                    paddingHorizontal="l"
                    paddingTop="m"
                    paddingBottom="xs"
                  >
                    {section.title}
                  </Text>
                )}
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: theme.spacing.l,
                      paddingVertical: theme.spacing.m,
                    }}
                  >
                    <Box
                      width={36}
                      height={36}
                      borderRadius="s"
                      backgroundColor={item.destructive ? "red100" : "gray100"}
                      alignItems="center"
                      justifyContent="center"
                      marginRight="m"
                    >
                      {item.icon}
                    </Box>
                    <Text
                      variant="body"
                      style={{
                        flex: 1,
                        color: item.destructive
                          ? theme.colors.error
                          : theme.colors.text,
                      }}
                    >
                      {item.label}
                    </Text>
                    {!item.destructive && (
                      <ChevronRight
                        size={16}
                        color={theme.colors.textTertiary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </Box>
            ))}
          </ScrollView>

          {/* Footer */}
          <Box alignItems="center" paddingTop="m">
            <Text variant="caption" color="textTertiary">
              {AppName} v1.0.0
            </Text>
            <Text variant="caption" color="textTertiary">
              by Headbox Studio
            </Text>
          </Box>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default DrawerMenu;
