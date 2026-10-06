import { Box } from "@/components/authorable/Box";
import { Card } from "@/components/authorable/Card";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { Text } from "@/components/authorable/Text";
import { AppName } from "@/constants/Common";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";

interface TermsSection {
  title: string;
  content: string;
}

const sections: TermsSection[] = [
  {
    title: "1. Aceptación de los términos",
    content: `Al crear una cuenta y utilizar ${AppName}, aceptas estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguno de los términos, por favor no uses la aplicación.`,
  },
  {
    title: "2. Descripción del servicio",
    content: `${AppName} es una plataforma de gestión de tandas (círculos de ahorro) que facilita la organización y seguimiento de grupos de ahorro cooperativo. No somos una institución financiera ni un banco.`,
  },
  {
    title: "3. Elegibilidad",
    content: `Debes tener al menos 18 años para usar ${AppName}. Al registrarte, confirmas que tienes la edad legal y capacidad para aceptar estos términos en tu país de residencia.`,
  },
  {
    title: "4. Responsabilidad financiera",
    content: `Las transacciones de dinero entre participantes son responsabilidad exclusiva de los usuarios. ${AppName} no garantiza los pagos entre participantes ni asume responsabilidad por pérdidas derivadas del incumplimiento de otros usuarios.`,
  },
  {
    title: "5. Conducta del usuario",
    content:
      "Te comprometes a usar la plataforma de buena fe, proporcionar información veraz, no suplantar identidades y no usar la aplicación para actividades ilegales o fraudulentas. El incumplimiento puede resultar en la suspensión de tu cuenta.",
  },
  {
    title: "6. Creación y gestión de círculos",
    content:
      "Al crear un círculo, eres responsable de comunicar claramente las reglas a los participantes y de gestionar el grupo con transparencia. Como administrador, tienes la obligación de velar por el buen funcionamiento del círculo.",
  },
  {
    title: "7. Privacidad",
    content:
      "El uso de tus datos personales se rige por nuestra Política de Privacidad, la cual forma parte integral de estos Términos y Condiciones.",
  },
  {
    title: "8. Propiedad intelectual",
    content: `Todo el contenido, diseño y código de ${AppName} es propiedad de Headbox Studio. No puedes reproducir, distribuir ni crear trabajos derivados sin autorización previa por escrito.`,
  },
  {
    title: "9. Limitación de responsabilidad",
    content: `${AppName} se proporciona \"tal cual\". No garantizamos disponibilidad ininterrumpida ni ausencia de errores. No seremos responsables por daños indirectos, incidentales o consecuentes derivados del uso de la aplicación.`,
  },
  {
    title: "10. Modificaciones",
    content:
      "Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios entrarán en vigor al ser publicados. El uso continuado de la aplicación tras la publicación implica aceptación.",
  },
  {
    title: "11. Terminación",
    content:
      "Podemos suspender o eliminar tu cuenta si incumples estos Términos. Tú puedes eliminar tu cuenta en cualquier momento desde la configuración de la aplicación.",
  },
  {
    title: "12. Ley aplicable",
    content:
      "Estos Términos se rigen por las leyes aplicables en el país de operación. Cualquier disputa se resolverá mediante arbitraje o ante los tribunales competentes.",
  },
];

export default function TermsScreen() {
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
                Términos
              </Text>
              <Text variant="body" style={{ color: "rgba(255,255,255,0.8)" }}>
                Términos y condiciones
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
            Lee cuidadosamente estos Términos y Condiciones antes de usar{" "}
            {AppName}. Estos términos establecen tus derechos y
            responsabilidades como usuario de nuestra plataforma.
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
