import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import CircleIcon from "@/components/authorable/CircleIcon";
import IconButton from "@/components/authorable/IconButton";
import { Text } from "@/components/authorable/Text";
import { CIRCLE_STATUS } from "@/constants/circles";
import { useCancelCircle } from "@/hooks/mutations/useCircleMutations";
import { Theme } from "@/theme";
import { Circle } from "@/types/api";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { Trash2, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Modal,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

interface CircleOptionsMenuProps {
  circle: Circle;
}

/**
 * The creator's "···" header button: an options menu with "Eliminar círculo",
 * which opens a confirmation modal that cancels the circle.
 */
export const CircleOptionsMenu = ({ circle }: CircleOptionsMenuProps) => {
  const theme = useTheme<Theme>();
  const cancelCircleMutation = useCancelCircle();

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelConfirmation, setCancelConfirmation] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);
  // iOS can only present one Modal at a time: opening the cancel modal while
  // the options menu is still dismissing is silently dropped. Queue it and
  // open it from the menu's onDismiss instead.
  const openCancelAfterMenuDismiss = useRef(false);

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelConfirmation("");
    setCancelError(null);
  };

  const handleCancelCircle = async () => {
    // Errors are shown inside the cancel modal: opening the error dialog (a
    // second Modal) on top of it leaves the screen unresponsive.
    if (cancelConfirmation !== circle.name) {
      setCancelError(
        "Por favor escribe exactamente el nombre del círculo para confirmar la cancelación.",
      );
      return;
    }

    setCancelError(null);
    try {
      await cancelCircleMutation.mutateAsync(circle.id);
      closeCancelModal();
      router.replace("/circles");
    } catch (error: any) {
      setCancelError(
        circle.status === CIRCLE_STATUS.active
          ? "Un círculo activo no se puede eliminar."
          : error?.message || "No se pudo cancelar el círculo.",
      );
    }
  };

  return (
    <>
      <IconButton onPress={() => setShowOptionsMenu(true)}>
        <Text variant="bodyBold" color="white">
          ···
        </Text>
      </IconButton>

      {/* Options Menu */}
      <Modal
        visible={showOptionsMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsMenu(false)}
        onDismiss={() => {
          if (!openCancelAfterMenuDismiss.current) return;
          openCancelAfterMenuDismiss.current = false;
          setShowCancelModal(true);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setShowOptionsMenu(false)}>
          <Box flex={1}>
            <TouchableWithoutFeedback>
              <Box
                style={{
                  position: "absolute",
                  top: 70,
                  right: theme.spacing.xl,
                  width: 220,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Box
                  backgroundColor="white"
                  borderRadius="m"
                  style={{ overflow: "hidden" }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowOptionsMenu(false);
                      if (Platform.OS === "ios") {
                        openCancelAfterMenuDismiss.current = true;
                      } else {
                        setShowCancelModal(true);
                      }
                    }}
                  >
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      gap="m"
                      paddingVertical="m"
                      paddingHorizontal="l"
                    >
                      <Trash2 size={18} color={theme.colors.error} />
                      <Text variant="body" color="error">
                        Eliminar círculo
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
            </TouchableWithoutFeedback>
          </Box>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Cancel Circle Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (cancelCircleMutation.isPending) return;
          closeCancelModal();
        }}
      >
        <Box
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal="l"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <Box
            backgroundColor="white"
            padding="l"
            borderRadius="m"
            width="100%"
            maxWidth={400}
          >
            <Box alignItems="center" marginBottom="l">
              <Text
                variant="titleBold"
                color="error"
                textAlign="center"
                marginBottom="s"
              >
                ⚠️ Cancelar Círculo
              </Text>
              <Text variant="body" color="textSecondary" textAlign="center">
                Esta acción no se puede deshacer. Todos los participantes serán
                notificados.
              </Text>
            </Box>

            <Box marginBottom="l">
              <Text variant="body" color="text" marginBottom="s">
                Para confirmar, escribe el nombre del círculo:
              </Text>
              <Text variant="bodyBold" color="text" marginBottom="m">
                &quot;{circle.name}&quot;
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.gray300,
                  borderRadius: theme.borderRadii.s,
                  padding: theme.spacing.m,
                  fontSize: 16,
                  color: theme.colors.text,
                }}
                placeholder="Escribe el nombre del círculo"
                value={cancelConfirmation}
                onChangeText={(text) => {
                  setCancelConfirmation(text);
                  setCancelError(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!cancelCircleMutation.isPending}
              />
              {cancelError && (
                <Text variant="caption" color="error" marginTop="s">
                  {cancelError}
                </Text>
              )}
            </Box>

            <Box flexDirection="row" alignItems="center" gap="m">
              <TouchableOpacity
                onPress={() => {
                  if (cancelCircleMutation.isPending) return;
                  closeCancelModal();
                }}
                activeOpacity={0.7}
              >
                <CircleIcon
                  size="medium"
                  icon={<X size={20} color={theme.colors.textSecondary} />}
                />
              </TouchableOpacity>
              <Button
                title="Eliminar Círculo"
                size="large"
                variant="secondary"
                onPress={handleCancelCircle}
                loading={cancelCircleMutation.isPending}
                disabled={cancelConfirmation !== circle.name}
                flex={1}
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
