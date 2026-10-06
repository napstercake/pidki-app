import { LoadingSpinner } from "@/components/authorable";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import Gradient from "@/components/authorable/Gradient";
import { Text } from "@/components/authorable/Text";
import { TextField } from "@/components/authorable/TextField";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { signInSchema, validateForm } from "@/utils/validations";
import { useTheme } from "@shopify/restyle";
import { Link, router } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function SignInScreen() {
  const theme = useTheme<Theme>();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    setErrors({});

    const { isValid, errors: validationErrors } = await validateForm(
      signInSchema,
      { email, password },
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.replace("/(tabs)");
    } else {
      setErrors({ general: "Correo o contraseña incorrectos." });
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando..." />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Box flex={1} testID="sign-in-screen">
          {/* Hero gradient header */}
          <Gradient
            colors={[
              theme.colors.linearGradientPrimary1,
              theme.colors.linearGradientPrimary3,
              theme.colors.linearGradientPrimary2,
            ]}
            style={{ paddingTop: 20 }}
          >
            <Box
              paddingHorizontal="l"
              paddingTop="xxxl"
              paddingBottom="xl"
              alignItems="center"
            >
              <Image
                source={require("../../../assets/images/logo-header.png")}
                style={{ width: 130, height: 52 }}
                resizeMode="contain"
              />
            </Box>

            {/* Wave cutout shape via border radius */}
            <Box
              height={36}
              backgroundColor="background"
              borderTopLeftRadius="xxxl"
              borderTopRightRadius="xxxl"
            />
          </Gradient>

          {/* Form area — flat on background, no card */}
          <Box
            flex={1}
            backgroundColor="background"
            paddingHorizontal="xl"
            paddingTop="m"
            paddingBottom="l"
          >
            <Text
              variant="titleBold"
              color="text"
              marginBottom="xs"
              textAlign="center"
            >
              Ahorra con tus amigos
            </Text>
            <Text
              variant="caption"
              color="textSecondary"
              marginBottom="xl"
              textAlign="center"
            >
              Inicia sesión para continuar
            </Text>

            <Box marginTop="xl">
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
                testID="sign-in-email-input"
              />
            </Box>

            <Box marginBottom="xs">
              <TextField
                label="Contraseña"
                placeholder="Tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                icon={<Lock size={20} color={theme.colors.textTertiary} />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    testID="sign-in-show-password-button"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={theme.colors.textTertiary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textTertiary} />
                    )}
                  </TouchableOpacity>
                }
                error={errors.password}
                variant="outlined"
                testID="sign-in-password-input"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </Box>

            {/* Forgot password — right-aligned, close to the password field */}
            <Box alignItems="flex-end" marginBottom="l">
              <Link href="/(auth)/restore-password" asChild>
                <TouchableOpacity testID="sign-in-forgot-password-link">
                  <Text
                    variant="caption"
                    color="primary"
                    style={{ fontWeight: "600" }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
              </Link>
            </Box>

            {errors.general && (
              <Text
                variant="caption"
                color="error"
                marginBottom="m"
                textAlign="center"
                testID="sign-in-error-message"
              >
                {errors.general}
              </Text>
            )}

            {/* Bottom-anchored group: CTA, sign up prompt, footer */}
            <Box flex={1} justifyContent="flex-end">
              <Button
                title="Iniciar sesión"
                onPress={handleLogin}
                disabled={loading}
                size="large"
                testID="sign-in-login-button"
                variant="black"
              />

              {/* Sign up prompt */}
              <Box
                marginTop="xl"
                flexDirection="row"
                justifyContent="center"
                gap="xs"
              >
                <Text variant="body" color="gray500">
                  ¿No tienes una cuenta?
                </Text>
                <Link href="/sign-up" asChild>
                  <TouchableOpacity testID="sign-in-signup-link">
                    <Text
                      variant="bodyBold"
                      color="primary"
                      style={{ fontWeight: "700" }}
                    >
                      Regístrate
                    </Text>
                  </TouchableOpacity>
                </Link>
              </Box>

              {/* Footer */}
              <Box alignItems="center" marginTop="xl">
                <Text variant="caption" color="gray400" textAlign="center">
                  Al iniciar sesión, aceptas nuestros Términos de Servicio y
                  Política de Privacidad
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
