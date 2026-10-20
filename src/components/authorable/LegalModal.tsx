import { ContactData } from "@/constants/Common";
import { PrivacyPolicyMarkdown, TermsOfServiceMarkdown } from "@/constants/Legal";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { Mail, X } from "lucide-react-native";
import React from "react";
import {
  Linking,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "./Box";
import { Markdown } from "./Markdown";
import { Text } from "./Text";

export type LegalDocument = "privacy" | "terms";

const documents: Record<LegalDocument, { title: string; content: string }> = {
  privacy: { title: "Política de Privacidad", content: PrivacyPolicyMarkdown },
  terms: { title: "Términos de Servicio", content: TermsOfServiceMarkdown },
};

interface LegalModalProps {
  /** Document to show; `null` hides the modal. */
  document: LegalDocument | null;
  onClose: () => void;
}

/**
 * Public (no auth required) sheet that renders the bundled legal documents.
 */
export const LegalModal: React.FC<LegalModalProps> = ({
  document,
  onClose,
}) => {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  // iOS pageSheet already sits below the status bar; Android is full screen.
  const topInset = Platform.OS === "ios" ? 0 : insets.top;
  const current = document ? documents[document] : null;

  return (
    <Modal
      visible={document !== null}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Box
        flex={1}
        backgroundColor="background"
        style={{ paddingTop: topInset }}
        testID="legal-modal"
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="l"
          paddingVertical="m"
          borderBottomWidth={1}
          borderBottomColor="borderLight"
        >
          <Text variant="subtitleBold" color="text" flex={1}>
            {current?.title}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Cerrar"
            testID="legal-modal-close-button"
          >
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </Box>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: theme.spacing.l,
            paddingBottom: theme.spacing.l + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          {current && <Markdown content={current.content} />}

          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:${ContactData.email}`)}
            testID="legal-modal-support-email"
          >
            <Box
              flexDirection="row"
              alignItems="center"
              gap="s"
              padding="m"
              marginTop="l"
              borderRadius="m"
              backgroundColor="white"
              borderWidth={1}
              borderColor="borderLight"
            >
              <Mail size={20} color={theme.colors.primary} />
              <Box flex={1}>
                <Text variant="caption" color="textTertiary">
                  ¿Tienes dudas? Escríbenos
                </Text>
                <Text variant="bodyBold" color="primary">
                  {ContactData.email}
                </Text>
              </Box>
            </Box>
          </TouchableOpacity>
        </ScrollView>
      </Box>
    </Modal>
  );
};

export default LegalModal;
