import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import Gradient from "@/components/authorable/Gradient";
import { Text } from "@/components/authorable/Text";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { router, useLocalSearchParams } from "expo-router";
import { MailCheck } from "lucide-react-native";

export default function VerifyEmailScreen() {
  const theme = useTheme<Theme>();
  const params = useLocalSearchParams();
  const email = typeof params.email === "string" ? params.email : undefined;

  return (
    <Gradient
      colors={[
        theme.colors.linearGradientPrimary1,
        theme.colors.linearGradientPrimary3,
        theme.colors.linearGradientPrimary2,
      ]}
      direction="vertical"
      style={{ flex: 1 }}
    >
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal="xl"
      >
        <Box
          width={80}
          height={80}
          borderRadius="round"
          backgroundColor="white"
          alignItems="center"
          justifyContent="center"
          marginBottom="xl"
        >
          <MailCheck size={40} color={theme.colors.linearGradientPrimary1} />
        </Box>

        <Text
          variant="titleBold"
          color="white"
          textAlign="center"
          marginBottom="m"
        >
          ¡Revisa tu correo!
        </Text>

        <Text
          variant="body"
          color="white"
          textAlign="center"
          style={{ opacity: 0.85 }}
        >
          {email
            ? `Te enviamos un enlace de verificación a ${email}. Ábrelo desde tu bandeja de entrada para activar tu cuenta.`
            : "Te enviamos un enlace de verificación a tu correo. Ábrelo desde tu bandeja de entrada para activar tu cuenta."}
        </Text>
      </Box>

      <Box paddingHorizontal="l" paddingBottom="xl">
        <Button
          title="Ir a iniciar sesión"
          variant="white"
          size="large"
          onPress={() => router.replace("/(auth)/sign-in")}
        />
      </Box>
    </Gradient>
  );
}
