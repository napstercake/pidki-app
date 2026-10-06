import { IconStroke } from "@/constants/Common";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { Menu } from "lucide-react-native";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "./Avatar";
import { Box } from "./Box";
import { DrawerMenu } from "./DrawerMenu";

interface HeaderProps {
  avatarUrl?: string | null;
  firstName?: string;
  lastName?: string;
  notificationCount?: number;
  borderBottom?: boolean;
  backgroundColor?: keyof Theme["colors"];
}

export const Header: React.FC<HeaderProps> = ({
  avatarUrl,
  firstName,
  lastName,
  notificationCount = 0,
  borderBottom = true,
  backgroundColor = "white",
}) => {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Box
        backgroundColor={backgroundColor}
        paddingHorizontal="l"
        paddingBottom="m"
        style={{ paddingTop: insets.top + 8 }}
        borderBottomWidth={borderBottom ? 1 : 0}
        borderBottomColor="gray100"
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Hamburger */}
          <TouchableOpacity
            onPress={() => setDrawerOpen(true)}
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Menu
              size={24}
              color={theme.colors.white}
              strokeWidth={IconStroke}
            />
          </TouchableOpacity>

          {/* Centered app logo */}
          <Box
            position="absolute"
            style={{ left: 0, right: 0 }}
            alignItems="center"
            pointerEvents="none"
          >
            <Image
              source={require("../../../assets/images/logo-header.png")}
              style={{ width: 75, height: 30 }}
              resizeMode="contain"
            />
          </Box>

          {/* Right actions */}
          <Box flexDirection="row" alignItems="center" gap="m">
            {/*
            LATER IMPLEMENTATION
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              style={{ position: "relative" }}
            >
              <BellRing
                size={22}
                color={theme.colors.white}
                strokeWidth={IconStroke}
              />
              {notificationCount > 0 && (
                <Box
                  position="absolute"
                  top={-4}
                  right={-4}
                  width={16}
                  height={16}
                  borderRadius="round"
                  backgroundColor="error"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    variant="caption"
                    color="white"
                    style={{ fontSize: 9, fontWeight: "700" }}
                  >
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </Text>
                </Box>
              )}
            </TouchableOpacity>*/}

            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
              <Avatar
                size="small"
                uri={avatarUrl}
                firstName={firstName}
                lastName={lastName}
                backgroundColor="gray200"
              />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>

      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default Header;
