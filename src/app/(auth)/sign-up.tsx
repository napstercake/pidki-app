import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { Text } from "@/components/authorable/Text";
import { TextField } from "@/components/authorable/TextField";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { signUpSchema, validateForm } from "@/utils/validations";
import { useTheme } from "@shopify/restyle";
import { Link, router } from "expo-router";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignupScreen() {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignup = async () => {
    setErrors({});

    const { isValid, errors: validationErrors } = await validateForm(
      signUpSchema,
      { firstName, lastName, email, password, confirmPassword },
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const trimmedEmail = email.trim();
      const result = await signup({
        email: trimmedEmail,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      if (result.status === "authenticated") {
        router.replace("/(tabs)");
      } else if (result.status === "verification-required") {
        router.replace({
          pathname: "/(auth)/verify-email",
          params: { email: trimmedEmail },
        });
      } else {
        setErrors({
          general:
            result.message || "Error al crear la cuenta. Intenta de nuevo.",
        });
      }
    } catch (error: any) {
      console.log(error);
      setErrors({
        general:
          error.message || "Error al crear la cuenta. Intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        testID="sign-up-screen"
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
          {/* Back button */}
          <Box style={{ paddingTop: insets.top, paddingLeft: 16 }}>
            <IconButton onPress={() => router.back()}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </IconButton>
          </Box>

          <Box
            paddingHorizontal="l"
            paddingBottom="xxl"
            paddingTop="m"
            alignItems="center"
          >
            <Image
              source={require("../../../assets/images/logo-header.png")}
              style={{ width: 130, height: 52 }}
              resizeMode="contain"
            />
          </Box>

          {/* Curved transition into form */}
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
          paddingHorizontal="l"
          paddingBottom="l"
        >
          <Text
            variant="titleBold"
            color="text"
            marginBottom="xs"
            textAlign="center"
          >
            Registrate
          </Text>
          <Text
            variant="caption"
            color="textSecondary"
            marginBottom="xl"
            textAlign="center"
          >
            Completa tus datos
          </Text>

          <Box flexDirection="row" gap="m" marginBottom="m" marginTop="m">
            <Box flex={1}>
              <TextField
                label="Nombre"
                placeholder="Tu nombre"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                autoCorrect={false}
                error={errors.firstName}
                icon={<User size={20} color={theme.colors.textTertiary} />}
                variant="outlined"
              />
            </Box>
            <Box flex={1}>
              <TextField
                label="Apellido"
                placeholder="Tu apellido"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                autoCorrect={false}
                error={errors.lastName}
                icon={<User size={20} color={theme.colors.textTertiary} />}
                variant="outlined"
              />
            </Box>
          </Box>

          <Box marginBottom="m">
            <TextField
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
              icon={<Mail size={20} color={theme.colors.textTertiary} />}
              variant="outlined"
            />
          </Box>

          <Box marginBottom="m">
            <TextField
              label="Contraseña"
              placeholder="Crea tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.password}
              icon={<Lock size={20} color={theme.colors.textTertiary} />}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={theme.colors.textTertiary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textTertiary} />
                  )}
                </TouchableOpacity>
              }
              variant="outlined"
            />
          </Box>

          <Box marginBottom="xs">
            <TextField
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.confirmPassword}
              icon={<Lock size={20} color={theme.colors.textTertiary} />}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={theme.colors.textTertiary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textTertiary} />
                  )}
                </TouchableOpacity>
              }
              variant="outlined"
            />
          </Box>

          {errors.general && (
            <Text
              color="error"
              textAlign="center"
              marginTop="m"
              marginBottom="s"
            >
              {errors.general}
            </Text>
          )}

          <Button
            title={isLoading ? "Creando cuenta..." : "Crear cuenta"}
            onPress={handleSignup}
            disabled={isLoading}
            marginTop="l"
            size="large"
            variant="black"
          />

          <Box
            marginTop="xl"
            flexDirection="row"
            justifyContent="center"
            gap="xs"
          >
            <Text variant="body" color="gray500">
              ¿Ya tienes una cuenta?
            </Text>
            <Link href="/sign-in" asChild>
              <TouchableOpacity>
                <Text
                  variant="body"
                  color="primary"
                  style={{ fontWeight: "700" }}
                >
                  Inicia sesión
                </Text>
              </TouchableOpacity>
            </Link>
          </Box>

          {/* Footer */}
          <Box alignItems="center" marginTop="xl">
            <Text variant="caption" color="textTertiary" textAlign="center">
              Al crear una cuenta, aceptas nuestros Términos de Servicio y
              Política de Privacidad
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
