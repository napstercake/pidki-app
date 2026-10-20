import { ContactData } from "@/constants/Common";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { CircleQuestionMark } from "lucide-react-native";
import React, { useState } from "react";
import { Linking, TouchableOpacity } from "react-native";
import { Box } from "./Box";
import { LegalDocument, LegalModal } from "./LegalModal";
import { Text } from "./Text";

interface LegalFooterProps {
  /** Lead-in sentence, e.g. "Al iniciar sesión, aceptas nuestros". */
  prefix: string;
}

const linkStyle = { textDecorationLine: "underline" } as const;

/**
 * Auth-screen footer with tappable Terms / Privacy links (opened in a public
 * modal) and a support email tag.
 */
export const LegalFooter: React.FC<LegalFooterProps> = ({ prefix }) => {
  const theme = useTheme<Theme>();
  const [document, setDocument] = useState<LegalDocument | null>(null);

  return (
    <Box alignItems="center" marginTop="xl" gap="m">
      <Text variant="caption" color="textLight" textAlign="center">
        {prefix}{" "}
        <Text
          variant="caption"
          color="text"
          style={linkStyle}
          onPress={() => setDocument("terms")}
          testID="legal-footer-terms-link"
        >
          Términos de Servicio
        </Text>{" "}
        y{" "}
        <Text
          variant="caption"
          color="text"
          style={linkStyle}
          onPress={() => setDocument("privacy")}
          testID="legal-footer-privacy-link"
        >
          Política de Privacidad
        </Text>
      </Text>

      <TouchableOpacity
        onPress={() => Linking.openURL(`mailto:${ContactData.email}`)}
        accessibilityRole="link"
        testID="legal-footer-support-email"
      >
        <Box
          flexDirection="row"
          alignItems="center"
          gap="xs"
          paddingHorizontal="m"
          paddingVertical="s"
          borderRadius="round"
          backgroundColor="borderLight"
          borderWidth={1}
          borderColor="gray200"
        >
          <CircleQuestionMark size={14} color={theme.colors.text} />
          <Text variant="caption" color="textSecondary">
            ¿Tienes dudas?
          </Text>
          <Text variant="captionBold" color="text">
            {ContactData.email}
          </Text>
        </Box>
      </TouchableOpacity>

      <LegalModal document={document} onClose={() => setDocument(null)} />
    </Box>
  );
};

export default LegalFooter;
