import { Theme } from "@/theme";
import React from "react";
import {
  Dimensions,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Box } from "./Box";
import { Button } from "./Button";
import { Text } from "./Text";

interface AlertDialogProps {
  visible: boolean;
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  onConfirm?: () => void;
  onCancel: () => void;
  onClose?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  variant?: "default" | "success" | "warning" | "error" | "info";
  showCloseButton?: boolean;
  dismissible?: boolean;
  stackedButtons?: boolean;
  confirmButtonVariant?:
    | "primary"
    | "secondary"
    | "outline"
    | "black"
    | "outlinePrimary"
    | "outlineSecondary"
    | "outlineError"
    | "gray"
    | "outlineGray";
  cancelButtonVariant?:
    | "primary"
    | "secondary"
    | "outline"
    | "black"
    | "outlinePrimary"
    | "outlineSecondary"
    | "outlineError"
    | "gray"
    | "outlineGray";
}

const { width: screenWidth } = Dimensions.get("window");

export const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  title,
  description,
  icon,
  onConfirm,
  onCancel,
  onClose,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmLoading = false,
  variant = "default",
  showCloseButton = false,
  dismissible = true,
  stackedButtons = false,
  confirmButtonVariant = "primary",
  cancelButtonVariant = "outline",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          iconColor: "success" as keyof Theme["colors"],
          borderColor: "success" as keyof Theme["colors"],
        };
      case "warning":
        return {
          iconColor: "warning" as keyof Theme["colors"],
          borderColor: "warning" as keyof Theme["colors"],
        };
      case "error":
        return {
          iconColor: "error" as keyof Theme["colors"],
          borderColor: "error" as keyof Theme["colors"],
        };
      case "info":
        return {
          iconColor: "info" as keyof Theme["colors"],
          borderColor: "info" as keyof Theme["colors"],
        };
      default:
        return {
          iconColor: "primary" as keyof Theme["colors"],
          borderColor: "primary" as keyof Theme["colors"],
        };
    }
  };

  const variantStyles = getVariantStyles();

  const handleOverlayPress = () => {
    if (dismissible && !confirmLoading) {
      if (onClose) {
        onClose();
      } else {
        onCancel();
      }
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (confirmLoading) return;
    onCancel();
  };

  const handleClose = () => {
    if (confirmLoading) return;
    if (onClose) {
      onClose();
    } else {
      onCancel();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          paddingHorizontal="l"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <TouchableWithoutFeedback>
            <Box
              backgroundColor="white"
              borderRadius="l"
              padding="xl"
              width={screenWidth * 0.9}
              maxWidth={400}
              alignItems="center"
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {showCloseButton && (
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 1,
                  }}
                >
                  <Box
                    width={24}
                    height={24}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text variant="body" color="textTertiary">
                      ×
                    </Text>
                  </Box>
                </TouchableOpacity>
              )}

              {icon && (
                <Box marginBottom="m" alignItems="center">
                  <Box
                    width={64}
                    height={64}
                    borderRadius="round"
                    backgroundColor="gray50"
                    justifyContent="center"
                    alignItems="center"
                    borderWidth={2}
                    borderColor={variantStyles.borderColor}
                  >
                    <Box>{icon}</Box>
                  </Box>
                </Box>
              )}

              <Text
                variant="titleBold"
                textAlign="center"
                marginBottom={description ? "s" : "l"}
                color="text"
              >
                {title}
              </Text>

              {description &&
                (typeof description === "string" ? (
                  <Text
                    variant="body"
                    textAlign="center"
                    color="textSecondary"
                    marginBottom="l"
                    lineHeight={22}
                  >
                    {description}
                  </Text>
                ) : (
                  <Box width="100%" marginBottom="l">
                    {description}
                  </Box>
                ))}

              <Box
                flexDirection={stackedButtons ? "column" : "row"}
                width="100%"
                justifyContent="space-between"
                gap="m"
              >
                {stackedButtons ? (
                  <>
                    {onConfirm && (
                      <Box flex={undefined}>
                        <Button
                          title={confirmText}
                          variant={confirmButtonVariant}
                          onPress={handleConfirm}
                          loading={confirmLoading}
                          size="large"
                        />
                      </Box>
                    )}

                    {(!onConfirm || cancelText) && (
                      <Box flex={undefined}>
                        <Button
                          title={cancelText}
                          variant={cancelButtonVariant}
                          onPress={handleCancel}
                          disabled={confirmLoading}
                          size="large"
                        />
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    {(!onConfirm || cancelText) && (
                      <Box flex={1}>
                        <Button
                          title={cancelText}
                          variant={cancelButtonVariant}
                          onPress={handleCancel}
                          disabled={confirmLoading}
                          size="large"
                        />
                      </Box>
                    )}

                    {onConfirm && (
                      <Box flex={1}>
                        <Button
                          title={confirmText}
                          variant={confirmButtonVariant}
                          onPress={handleConfirm}
                          loading={confirmLoading}
                          size="large"
                        />
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </TouchableWithoutFeedback>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AlertDialog;
