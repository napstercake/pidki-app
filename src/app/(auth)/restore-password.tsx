import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { Text } from "@/components/authorable/Text";
import { TextField } from "@/components/authorable/TextField";
import { AuthApi } from "@/services/api/auth";
import { Theme } from "@/theme";
import { restorePasswordSchema, validateForm } from "@/utils/validations";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { ChevronLeft, Mail, MailCheck } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RestorePasswordScreen() {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setErrors({});

    const { isValid, errors: validationErrors } = await validateForm(
      restorePasswordSchema,
      { email },
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await AuthApi.forgotPassword(email.trim());
      setSubmitted(true);

      setTimeout(() => {
        router.replace("/(auth)/sign-in");
      }, 4000);
    } catch (error: any) {
      setErrors({
        general:
          error.message || "No se pudo enviar el correo. Intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary3,
          theme.colors.linearGradientPrimary2,
        ]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Box alignItems="center" paddingHorizontal="xl">
          <Box
            backgroundColor="white"
            justifyContent="center"
            alignItems="center"
            style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 28 }}
          >
            <MailCheck size={40} color={theme.colors.linearGradientPrimary1} />
          </Box>
          <Text
            color="white"
            marginBottom="m"
            textAlign="center"
            style={{ fontSize: 28, fontWeight: "700", letterSpacing: -0.3 }}
          >
            ¡Correo enviado!
          </Text>
          <Text
            textAlign="center"
            marginBottom="l"
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 24,
            }}
          >
            Si el correo está registrado, recibirás instrucciones para
            restablecer tu contraseña.
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
            }}
          >
            Redirigiendo al inicio de sesión...
          </Text>
        </Box>
      </Gradient>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero gradient header */}
      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary3,
          theme.colors.linearGradientPrimary2,
        ]}
        style={{ paddingTop: 20 }}
      >
        <Box paddingLeft="m" style={{ paddingTop: insets.top }}>
          <IconButton onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.white} />
          </IconButton>
        </Box>

        <Box paddingHorizontal="l" paddingBottom="xxl" paddingTop="m">
          <Image
            source={require("../../../assets/images/logo-header.png")}
            style={{ width: 130, height: 52 }}
            resizeMode="contain"
          />
          <Text
            variant="subtitle"
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 17,
              marginTop: 6,
            }}
          >
            Recuperar contraseña
          </Text>
        </Box>

        {/* Curved transition */}
        <Box
          height={36}
          backgroundColor="background"
          borderTopLeftRadius="xxxl"
          borderTopRightRadius="xxxl"
        />
      </Gradient>

      {/* Form area — flat, no card */}
      <Box
        flex={1}
        backgroundColor="background"
        paddingHorizontal="xl"
        paddingTop="l"
        paddingBottom="l"
      >
        <Text variant="titleBold" color="text" marginBottom="xs">
          ¿Olvidaste tu contraseña?
        </Text>
        <Text variant="caption" color="textSecondary" marginBottom="xl">
          Ingresa tu correo y te enviaremos instrucciones para restablecerla.
        </Text>

        <Box marginBottom="xs">
          <TextField
            label="Correo electrónico"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            icon={<Mail size={20} color={theme.colors.textTertiary} />}
            error={errors.email}
            variant="outlined"
          />
        </Box>

        {errors.general && (
          <Text
            variant="caption"
            color="error"
            marginTop="s"
            marginBottom="s"
            textAlign="center"
          >
            {errors.general}
          </Text>
        )}

        <Button
          title={isLoading ? "Enviando..." : "Enviar instrucciones"}
          onPress={handleSubmit}
          disabled={isLoading}
          marginTop="l"
          size="large"
          variant="black"
        />
      </Box>
    </ScrollView>
  );
}
