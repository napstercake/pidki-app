import { Box } from "@/components/authorable/Box";
import { Card } from "@/components/authorable/Card";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { Text } from "@/components/authorable/Text";
import { AppName, ContactData } from "@/constants/Common";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";

interface PolicySection {
  title: string;
  content: string;
}

const sections: PolicySection[] = [
  {
    title: "1. Información que recopilamos",
    content:
      "Recopilamos información que nos proporcionas directamente, como nombre, correo electrónico, número de teléfono y datos de cuenta bancaria cuando los agregas voluntariamente. También recopilamos datos de uso de la aplicación para mejorar tu experiencia.",
  },
  {
    title: "2. Cómo usamos tu información",
    content:
      "Usamos tu información para gestionar tu cuenta, facilitar los círculos de ahorro, enviarte notificaciones relevantes y mejorar nuestros servicios. No vendemos tu información personal a terceros.",
  },
  {
    title: "3. Compartir información",
    content:
      "Solo compartimos tu información con otros participantes de tus círculos de ahorro (nombre y foto de perfil) y con proveedores de servicios que nos ayudan a operar la plataforma, bajo estrictos acuerdos de confidencialidad.",
  },
  {
    title: "4. Seguridad de datos",
    content:
      "Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, alteración o divulgación. Sin embargo, ningún sistema es completamente seguro.",
  },
  {
    title: "5. Tus derechos",
    content:
      "Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento. Puedes ejercer estos derechos desde la configuración de tu cuenta o contactándonos directamente.",
  },
  {
    title: "6. Retención de datos",
    content:
      "Conservamos tu información mientras tu cuenta esté activa o según sea necesario para prestarte servicios. Si eliminas tu cuenta, borraremos o anonimizaremos tus datos dentro de los 30 días siguientes.",
  },
  {
    title: "7. Cookies y tecnologías similares",
    content:
      "Usamos tecnologías de seguimiento para mejorar tu experiencia en la aplicación, analizar el uso y personalizar el contenido. Puedes controlar estas preferencias desde los ajustes de tu dispositivo.",
  },
  {
    title: "8. Cambios a esta política",
    content:
      "Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios significativos a través de la aplicación o por correo electrónico. El uso continuado de la aplicación implica aceptación de los cambios.",
  },
  {
    title: "9. Contacto",
    content: `Si tienes preguntas sobre esta política, contáctanos en ${ContactData.privacyEmail} o a través de la sección de soporte en la aplicación.`,
  },
];

export default function PrivacyPolicyScreen() {
  const theme = useTheme<Theme>();

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
                Privacidad
              </Text>
              <Text variant="body" style={{ color: "rgba(255,255,255,0.8)" }}>
                Política de privacidad
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
        <Card padding="l" marginBottom="l">
          <Text variant="caption" color="textTertiary" marginBottom="xs">
            Última actualización: Junio 2025
          </Text>
          <Text variant="body" color="textSecondary" lineHeight={24}>
            En {AppName} nos tomamos tu privacidad en serio. Esta política
            describe cómo recopilamos, usamos y protegemos tu información
            personal cuando utilizas nuestra aplicación.
          </Text>
        </Card>

        <Box gap="m">
          {sections.map((section, index) => (
            <Card key={index} padding="l">
              <Text variant="bodyBold" color="text" marginBottom="s">
                {section.title}
              </Text>
              <Text variant="body" color="textSecondary" lineHeight={24}>
                {section.content}
              </Text>
            </Card>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}
