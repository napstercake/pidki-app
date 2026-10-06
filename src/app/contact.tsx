import { Box } from "@/components/authorable/Box";
import { Card } from "@/components/authorable/Card";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { Text } from "@/components/authorable/Text";
import { ContactData } from "@/constants/Common";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { ChevronLeft, Mail, MessageCircle, Phone } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";

interface ContactOption {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action: () => void;
}

export default function ContactScreen() {
  const theme = useTheme<Theme>();

  const contactOptions: ContactOption[] = [
    {
      icon: <Mail size={24} color={theme.colors.primary} />,
      title: "Correo electrónico",
      subtitle: ContactData.email,
      action: () => Linking.openURL(`mailto:${ContactData.email}`),
    },
    {
      icon: <MessageCircle size={24} color={theme.colors.secondary} />,
      title: "WhatsApp",
      subtitle: ContactData.whatsapp,
      action: () =>
        Linking.openURL(
          `https://wa.me/${ContactData.whatsapp.replace(/\D/g, "")}`,
        ),
    },
    {
      icon: <Phone size={24} color={theme.colors.accent} />,
      title: "Teléfono",
      subtitle: ContactData.phone,
      action: () =>
        Linking.openURL(`tel:${ContactData.phone.replace(/\s/g, "")}`),
    },
  ];

  return (
    <Box flex={1} backgroundColor="background">
      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary2,
        ]}
      >
        <Box paddingHorizontal="l" paddingTop="xxxl" paddingBottom="l">
          <Box flexDirection="row" alignItems="center" marginBottom="m">
            <IconButton onPress={() => router.back()}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </IconButton>
            <Box flex={1} marginLeft="m">
              <Text variant="titleBold" style={{ color: "#FFFFFF" }}>
                Contáctanos
              </Text>
              <Text variant="body" style={{ color: "rgba(255,255,255,0.8)" }}>
                Estamos aquí para ayudarte
              </Text>
            </Box>
          </Box>
        </Box>
      </Gradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.l }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="body" color="textSecondary" marginBottom="l">
          ¿Tienes alguna pregunta o problema? Elige el canal que prefieras y
          nuestro equipo te responderá lo antes posible.
        </Text>

        <Box gap="m">
          {contactOptions.map((option, index) => (
            <Card key={index} padding="l">
              <TouchableOpacity onPress={option.action} activeOpacity={0.7}>
                <Box flexDirection="row" alignItems="center">
                  <Box
                    width={48}
                    height={48}
                    borderRadius="m"
                    backgroundColor="gray100"
                    alignItems="center"
                    justifyContent="center"
                    marginRight="m"
                  >
                    {option.icon}
                  </Box>
                  <Box flex={1}>
                    <Text variant="bodyBold" color="text">
                      {option.title}
                    </Text>
                    <Text variant="caption" color="textSecondary">
                      {option.subtitle}
                    </Text>
                  </Box>
                </Box>
              </TouchableOpacity>
            </Card>
          ))}
        </Box>

        <Card padding="l" marginTop="l">
          <Text variant="subtitle" color="text" marginBottom="s">
            Tiempo de respuesta
          </Text>
          <Text variant="body" color="textSecondary" lineHeight={24}>
            Nos esforzamos por responder todos los mensajes dentro de las
            primeras 24 horas en días hábiles. Para urgencias, utiliza el chat
            en vivo o el teléfono.
          </Text>
        </Card>
      </ScrollView>
    </Box>
  );
}
