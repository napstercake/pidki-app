import { AlertDialog } from "@/components/authorable";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import { Card } from "@/components/authorable/Card";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { StatusLabel } from "@/components/authorable/StatusLabel";
import { Text } from "@/components/authorable/Text";
import { TextField } from "@/components/authorable/TextField";
import { useDeleteAccount } from "@/hooks/mutations/useUserMutations";
import { ApiError } from "@/services/api/users";
import { Theme } from "@/theme";
import { DeleteAccountBlockingCircle } from "@/types/api";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const ERASED_ITEMS = [
  "Tu nombre, correo, contraseña y foto de perfil.",
  "Todas tus cuentas bancarias registradas.",
  "Las invitaciones pendientes que recibiste serán rechazadas.",
  "Se cerrará tu sesión en todos tus dispositivos.",
];

const KEPT_ITEMS = [
  "Los círculos y el historial de pagos se conservan para que las cuentas de los demás miembros sigan cuadrando. Donde aparecías, se mostrará “Usuario eliminado”.",
  "Podrás registrarte de nuevo con el mismo correo, pero será una cuenta nueva y vacía.",
];

export default function DeleteAccountScreen() {
  const theme = useTheme<Theme>();
  const deleteAccount = useDeleteAccount();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [blockingCircles, setBlockingCircles] = useState<
    DeleteAccountBlockingCircle[]
  >([]);

  const handleRequestDelete = () => {
    if (!password.trim()) {
      setPasswordError("Ingresa tu contraseña para confirmar.");
      return;
    }
    setPasswordError(undefined);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setShowConfirmDialog(false);
    setBlockingCircles([]);
    try {
      await deleteAccount.mutateAsync(password);
      router.replace("/(auth)/sign-in");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setPasswordError("Contraseña incorrecta. Intenta de nuevo.");
        return;
      }
      if (error instanceof ApiError && error.status === 409) {
        const circles: DeleteAccountBlockingCircle[] =
          error.data?.circles ?? error.data?.data?.circles ?? [];
        setBlockingCircles(circles);
        if (circles.length === 0) setErrorMessage(error.message);
        return;
      }
      setErrorMessage(
        (error as Error)?.message ||
          "No se pudo eliminar tu cuenta. Por favor, intenta de nuevo.",
      );
    }
  };

  return (
    <Box flex={1} backgroundColor="background">
      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary3,
          theme.colors.linearGradientPrimary2,
        ]}
      >
        <Box paddingHorizontal="l" paddingTop="xxxl" paddingBottom="l">
          <Box flexDirection="row" alignItems="center">
            <IconButton onPress={() => router.back()}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </IconButton>
            <Box flex={1} marginLeft="m">
              <Text
                variant="HeaderMiniBold"
                style={{ color: theme.colors.white }}
              >
                Eliminar cuenta
              </Text>
            </Box>
          </Box>
        </Box>
      </Gradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: theme.spacing.l }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Warning */}
          <Card padding="l" marginBottom="l">
            <Box flexDirection="row" alignItems="center" marginBottom="m">
              <AlertTriangle size={22} color={theme.colors.error} />
              <Text variant="bodyBold" color="error" marginLeft="s">
                Esta acción no se puede deshacer
              </Text>
            </Box>
            <Text variant="body" color="textSecondary">
              Una vez eliminada, ni tú ni nuestro equipo podremos recuperar tu
              cuenta.
            </Text>
          </Card>

          <Text variant="bodyBold" color="text" fontSize={18} marginBottom="m">
            Qué se elimina
          </Text>
          <Card padding="l" marginBottom="l">
            <Box gap="s">
              {ERASED_ITEMS.map((item) => (
                <Bullet key={item} text={item} />
              ))}
            </Box>
          </Card>

          <Text variant="bodyBold" color="text" fontSize={18} marginBottom="m">
            Qué se conserva
          </Text>
          <Card padding="l" marginBottom="l">
            <Box gap="s">
              {KEPT_ITEMS.map((item) => (
                <Bullet key={item} text={item} />
              ))}
            </Box>
          </Card>

          {/* Blocking circles (409) */}
          {blockingCircles.length > 0 && (
            <>
              <Text
                variant="bodyBold"
                color="text"
                fontSize={18}
                marginBottom="s"
              >
                Antes de continuar
              </Text>
              <Text variant="body" color="textSecondary" marginBottom="m">
                Tienes círculos pendientes. Finalízalos o cancélalos para poder
                eliminar tu cuenta.
              </Text>
              <Card padding="l" marginBottom="l">
                <Box gap="s">
                  {blockingCircles.map((circle) => (
                    <TouchableOpacity
                      key={circle.id ?? circle.name}
                      disabled={!circle.id}
                      onPress={() => router.push(`/circle/${circle.id}`)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: theme.spacing.s,
                      }}
                    >
                      <Box flex={1} gap="xs">
                        <Text variant="bodyBold" color="text">
                          {circle.name}
                        </Text>
                        <Box flexDirection="row" alignItems="center" gap="s">
                          <StatusLabel status={circle.status} />
                          <Text variant="caption" color="textSecondary">
                            {circle.role === "CREATOR" ? "Creador" : "Miembro"}
                          </Text>
                        </Box>
                      </Box>
                      {circle.id && (
                        <ChevronRight
                          size={16}
                          color={theme.colors.textTertiary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </Box>
              </Card>
            </>
          )}

          <Text variant="bodyBold" color="text" fontSize={18} marginBottom="m">
            Confirma con tu contraseña
          </Text>
          <Card padding="l" marginBottom="l">
            <TextField
              label="Contraseña"
              placeholder="Tu contraseña"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (passwordError) setPasswordError(undefined);
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
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
              error={passwordError}
              variant="outlined"
              returnKeyType="done"
              onSubmitEditing={handleRequestDelete}
            />
          </Card>

          <Button
            title="Eliminar mi cuenta"
            variant="outlineError"
            size="large"
            onPress={handleRequestDelete}
            disabled={deleteAccount.isPending}
            loading={deleteAccount.isPending}
            icon={<Trash2 size={18} color={theme.colors.error} />}
            marginBottom="xl"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertDialog
        visible={showConfirmDialog}
        title="¿Eliminar tu cuenta?"
        description="Se borrarán tus datos de forma permanente. Esta acción no se puede deshacer."
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="warning"
        confirmButtonVariant="outlineError"
        cancelButtonVariant="outlineGray"
      />

      <AlertDialog
        visible={!!errorMessage}
        title="Error"
        description={errorMessage ?? ""}
        icon={<X size={24} color={theme.colors.error} />}
        onCancel={() => setErrorMessage(undefined)}
        confirmText="Cerrar"
        cancelText="Cerrar"
        variant="error"
        confirmButtonVariant="outlineError"
        cancelButtonVariant="outlineGray"
      />
    </Box>
  );
}

function Bullet({ text }: { text: string }) {
  const theme = useTheme<Theme>();
  return (
    <Box flexDirection="row" alignItems="flex-start">
      <Box
        width={6}
        height={6}
        borderRadius="round"
        marginTop="s"
        marginRight="s"
        style={{ backgroundColor: theme.colors.textSecondary }}
      />
      <Text variant="body" color="text" style={{ flex: 1 }}>
        {text}
      </Text>
    </Box>
  );
}
