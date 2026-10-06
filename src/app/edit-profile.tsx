import { AlertDialog } from "@/components/authorable";
import { Avatar } from "@/components/authorable/Avatar";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import { Card } from "@/components/authorable/Card";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { Text } from "@/components/authorable/Text";
import { TextField } from "@/components/authorable/TextField";
import {
  useDeleteAvatar,
  useUpdateProfile,
  useUploadAvatar,
} from "@/hooks/mutations/useUserMutations";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { editProfileSchema, validateForm } from "@/utils/validations";
import { useTheme } from "@shopify/restyle";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import {
  Camera,
  Check,
  ChevronLeft,
  Image as ImageIcon,
  User,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function EditProfileScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <EditProfileContent />
    </>
  );
}

function EditProfileContent() {
  const theme = useTheme<Theme>();
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const isLoading =
    updateProfileMutation.isPending ||
    uploadAvatarMutation.isPending ||
    deleteAvatarMutation.isPending;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const pickImageFromResult = async (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setAvatarUri(asset.uri);
    setShowImageOptions(false);
    await uploadAvatar(asset.uri);
  };

  const handlePickImage = () => {
    setShowImageOptions(true);
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setErrors({ general: "Se necesita permiso para acceder a la cámara." });
      setShowErrorDialog(true);
      setShowImageOptions(false);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    await pickImageFromResult(result);
  };

  const handleChooseFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setErrors({ general: "Se necesita permiso para acceder a la galería." });
      setShowErrorDialog(true);
      setShowImageOptions(false);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    await pickImageFromResult(result);
  };

  const uploadAvatar = async (uri: string) => {
    try {
      const file = new File(uri);

      const formData = new FormData();
      formData.append("avatar", file, file.name);

      await uploadAvatarMutation.mutateAsync(formData);
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setAvatarUri(null);
      setErrors({
        general:
          error.message ||
          "No se pudo subir la foto. Por favor, intenta de nuevo.",
      });
      setShowErrorDialog(true);
    }
  };

  const handleRemoveImage = async () => {
    setShowImageOptions(false);
    try {
      await deleteAvatarMutation.mutateAsync();
      setAvatarUri(null);
    } catch (error: any) {
      console.error("Error deleting avatar:", error);
      setErrors({
        general:
          error.message ||
          "No se pudo eliminar la foto. Por favor, intenta de nuevo.",
      });
      setShowErrorDialog(true);
    }
  };

  const handleSave = async () => {
    setErrors({});

    const { isValid, errors: validationErrors } = await validateForm(
      editProfileSchema,
      { firstName, lastName },
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrors({
        general:
          error.message ||
          "No se pudo actualizar el perfil. Por favor, intenta de nuevo.",
      });
      setShowErrorDialog(true);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    router.back();
  };

  const hasChanges =
    firstName !== user?.firstName ||
    lastName !== user?.lastName ||
    avatarUri !== null;

  return (
    <Box flex={1} backgroundColor="background">
      {/* Header */}
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
                Editar perfil
              </Text>
            </Box>
          </Box>
        </Box>
      </Gradient>

      {/* Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: theme.spacing.l }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <Box alignItems="center" padding="l" marginBottom="l">
            <Text
              variant="subtitle"
              color="text"
              marginBottom="m"
              textAlign="center"
            >
              Foto
            </Text>

            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
              <Box position="relative">
                {avatarUri || user?.avatarUrl ? (
                  <Box
                    width={100}
                    height={100}
                    borderRadius="round"
                    overflow="hidden"
                    borderWidth={3}
                    borderColor="primary"
                  >
                    <RNImage
                      source={{
                        uri: avatarUri || user?.avatarUrl || undefined,
                      }}
                      style={{ width: 100, height: 100, borderRadius: 50 }}
                    />
                  </Box>
                ) : (
                  <Box
                    borderWidth={3}
                    borderColor="primary"
                    borderRadius="round"
                    padding="xs"
                  >
                    <Avatar
                      size="large"
                      firstName={firstName || user?.firstName}
                      lastName={lastName || user?.lastName}
                      backgroundColor="gray300"
                    />
                  </Box>
                )}

                {/* Camera Badge */}
                <Box
                  position="absolute"
                  bottom={0}
                  right={0}
                  backgroundColor="primary"
                  borderRadius="round"
                  width={32}
                  height={32}
                  alignItems="center"
                  justifyContent="center"
                  borderWidth={2}
                  borderColor="white"
                >
                  <Camera size={16} color={theme.colors.white} />
                </Box>
              </Box>
            </TouchableOpacity>

            <Text
              variant="caption"
              color="textSecondary"
              marginTop="m"
              textAlign="center"
            >
              Toca para cambiar tu foto de perfil
            </Text>
          </Box>

          <Text variant="bodyBold" color="text" fontSize={18} marginBottom="m">
            Informacion personal
          </Text>

          {/* Form Section */}
          <Card padding="l" marginBottom="l">
            <TextField
              label="Nombre"
              placeholder="Ingresa tu nombre"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              autoCorrect={false}
              error={errors.firstName}
              icon={<User size={20} color={theme.colors.textTertiary} />}
              variant="outlined"
            />

            <TextField
              label="Apellido"
              placeholder="Ingresa tu apellido"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              autoCorrect={false}
              error={errors.lastName}
              icon={<User size={20} color={theme.colors.textTertiary} />}
              variant="outlined"
            />

            {errors.general && (
              <Box marginTop="s">
                <Text variant="caption" color="error" textAlign="center">
                  {errors.general}
                </Text>
              </Box>
            )}
          </Card>

          {/* Email Info (Read-only) */}
          <Card padding="l" marginBottom="l" backgroundColor="gray50">
            <Box flexDirection="row" alignItems="center">
              <Box
                backgroundColor="gray200"
                borderRadius="s"
                padding="s"
                marginRight="m"
              >
                <User size={20} color={theme.colors.textSecondary} />
              </Box>
              <Box flex={1}>
                <Text variant="caption" color="textSecondary">
                  Correo electronico
                </Text>
                <Text variant="body" color="text">
                  {user?.email}
                </Text>
              </Box>
            </Box>
            <Text variant="caption" color="textTertiary" marginTop="s">
              El correo electronico no puede ser modificado
            </Text>
          </Card>

          {/* Save Button */}
          <Button
            title="Guardar Cambios"
            onPress={handleSave}
            disabled={isLoading || !hasChanges}
            size="large"
            marginBottom="l"
            loading={isLoading}
            variant="primary2"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Image Options Modal */}
      {showImageOptions && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          justifyContent="flex-end"
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setShowImageOptions(false)}
            activeOpacity={1}
          />
          <Box
            backgroundColor="white"
            borderTopLeftRadius="l"
            borderTopRightRadius="l"
            padding="l"
            paddingBottom="xl"
          >
            <Box alignItems="center" marginBottom="m">
              <Box
                width={40}
                height={4}
                backgroundColor="gray300"
                borderRadius="round"
              />
            </Box>

            <Text
              variant="subtitle"
              color="text"
              textAlign="center"
              marginBottom="l"
            >
              Cambiar foto de perfil
            </Text>

            <Box gap="s">
              <TouchableOpacity onPress={handleTakePhoto} activeOpacity={0.7}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  padding="m"
                  backgroundColor="gray50"
                  borderRadius="m"
                >
                  <Camera size={24} color={theme.colors.primary} />
                  <Text variant="body" color="text" marginLeft="m">
                    Tomar foto
                  </Text>
                </Box>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleChooseFromGallery}
                activeOpacity={0.7}
              >
                <Box
                  flexDirection="row"
                  alignItems="center"
                  padding="m"
                  backgroundColor="gray50"
                  borderRadius="m"
                >
                  <ImageIcon size={24} color={theme.colors.primary} />
                  <Text variant="body" color="text" marginLeft="m">
                    Elegir de galeria
                  </Text>
                </Box>
              </TouchableOpacity>

              {(avatarUri || user?.avatarUrl) && (
                <TouchableOpacity
                  onPress={handleRemoveImage}
                  activeOpacity={0.7}
                >
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    padding="m"
                    backgroundColor="gray50"
                    borderRadius="m"
                  >
                    <X size={24} color={theme.colors.error} />
                    <Text variant="body" color="error" marginLeft="m">
                      Eliminar foto
                    </Text>
                  </Box>
                </TouchableOpacity>
              )}

              <Button
                title="Cancelar"
                variant="outlineGray"
                onPress={() => setShowImageOptions(false)}
                marginTop="s"
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Success Dialog */}
      <AlertDialog
        visible={showSuccessDialog}
        title="Perfil actualizado"
        description="Tu perfil ha sido actualizado exitosamente."
        icon={<Check size={24} color={theme.colors.success} />}
        onCancel={() => setShowSuccessDialog(false)}
        onConfirm={handleSuccessConfirm}
        confirmText="OK"
        cancelText="Cerrar"
        variant="success"
        confirmButtonVariant="primary"
        cancelButtonVariant="outlineGray"
      />

      {/* Error Dialog */}
      <AlertDialog
        visible={showErrorDialog}
        title="Error"
        description={
          errors.general ||
          "No se pudo actualizar el perfil. Por favor, intenta de nuevo."
        }
        icon={<X size={24} color={theme.colors.error} />}
        onCancel={() => setShowErrorDialog(false)}
        confirmText="Cerrar"
        cancelText="Cerrar"
        variant="error"
        confirmButtonVariant="outlineError"
        cancelButtonVariant="outlineGray"
      />
    </Box>
  );
}
