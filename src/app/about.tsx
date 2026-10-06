import { Box } from "@/components/authorable/Box";
import { Card } from "@/components/authorable/Card";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { Text } from "@/components/authorable/Text";
import { AppName } from "@/constants/Common";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { ChevronLeft, Shield, Users, Zap } from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function AboutScreen() {
  const theme = useTheme<Theme>();

  const features: FeatureItem[] = [
    {
      icon: <Users size={22} color={theme.colors.primary} />,
      title: "Comunidad",
      description:
        "Conecta con amigos, familia y compañeros para ahorrar juntos de forma organizada.",
    },
    {
      icon: <Shield size={22} color={theme.colors.secondary} />,
      title: "Confianza",
      description:
        "Transparencia total: todos los miembros ven el estado del círculo en tiempo real.",
    },
    {
      icon: <Zap size={22} color={theme.colors.accent} />,
      title: "Simple y rápido",
      description:
        "Crea tu círculo en minutos, invita participantes y comienza a ahorrar de inmediato.",
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
                Sobre nosotros
              </Text>
              <Text variant="body" style={{ color: "rgba(255,255,255,0.8)" }}>
                Conoce {AppName}
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
        {/* Hero card */}
        <Card padding="l" marginBottom="l">
          <Box
            width={64}
            height={64}
            borderRadius="l"
            backgroundColor="gray100"
            alignItems="center"
            justifyContent="center"
            marginBottom="m"
          >
            <Text style={{ fontSize: 32 }}>🐢</Text>
          </Box>
          <Text variant="titleBold" color="text" marginBottom="s">
            {AppName}
          </Text>
          <Text variant="body" color="textSecondary" lineHeight={24}>
            {AppName} es una aplicación de ahorro colaborativo que lleva el
            sistema tradicional de tandas latinoamericanas a la era digital.
            Permitimos que grupos de amigos, familia o compañeros junten dinero
            en rondas regulares y se turnen para recibir el total acumulado.
          </Text>
        </Card>

        {/* Mission */}
        <Card padding="l" marginBottom="l">
          <Text variant="subtitle" color="text" marginBottom="s">
            Nuestra misión
          </Text>
          <Text variant="body" color="textSecondary" lineHeight={24}>
            Democratizar el acceso al ahorro cooperativo eliminando las barreras
            bancarias. Creemos que cualquier persona merece una herramienta
            simple, confiable y culturalmente relevante para alcanzar sus metas
            financieras junto a su comunidad.
          </Text>
        </Card>

        {/* Features */}
        <Text variant="subtitle" color="text" marginBottom="m">
          ¿Por qué {AppName}?
        </Text>
        <Box gap="m" marginBottom="l">
          {features.map((feature, index) => (
            <Card key={index} padding="l">
              <Box flexDirection="row" alignItems="flex-start">
                <Box
                  width={44}
                  height={44}
                  borderRadius="m"
                  backgroundColor="gray100"
                  alignItems="center"
                  justifyContent="center"
                  marginRight="m"
                >
                  {feature.icon}
                </Box>
                <Box flex={1}>
                  <Text variant="bodyBold" color="text" marginBottom="xs">
                    {feature.title}
                  </Text>
                  <Text variant="caption" color="textSecondary" lineHeight={20}>
                    {feature.description}
                  </Text>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Version */}
        <Box alignItems="center" paddingBottom="l">
          <Text variant="caption" color="textTertiary">
            {AppName} v1.0.0
          </Text>
          <Text variant="caption" color="textTertiary">
            Hecho con ❤️ por Headbox Studio
          </Text>
        </Box>
      </ScrollView>
    </Box>
  );
}
