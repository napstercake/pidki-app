import { Box } from "@/components/authorable/Box";
import { Text } from "@/components/authorable/Text";
import { TextField } from "@/components/authorable/TextField";
import { PARTICIPANTS } from "@/constants/circles";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { Plus, X } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  emails: string[];
  emailErrors: string[];
  error: string | null;
  onEmailChange: (index: number, value: string) => void;
  onAddEmail: () => void;
  onRemoveEmail: (index: number) => void;
};

const Step2 = ({
  emails,
  emailErrors,
  error,
  onEmailChange,
  onAddEmail,
  onRemoveEmail,
}: Props) => {
  const theme = useTheme<Theme>();

  return (
    <>
      <Text
        variant="titleBold"
        color="text"
        marginBottom="m"
        textAlign="center"
      >
        Invita a tus amigos
      </Text>
      <Text
        variant="body"
        color="textSecondary"
        marginBottom="l"
        textAlign="center"
        style={{ fontStyle: "italic" }}
      >
        {`Agrega los correos electrónicos de los miembros (mínimo ${PARTICIPANTS.min}, máximo ${PARTICIPANTS.max}).`}
      </Text>
      {emails.map((email, i) => (
        <Box key={i} flexDirection="row" alignItems="center" marginBottom="s">
          <Box flex={1}>
            <TextField
              label={
                i === 0 ? "Email 1" : i === 1 ? "Email 2" : `Email ${i + 1}`
              }
              placeholder={`miembro${i + 1}@ejemplo.com`}
              value={email}
              onChangeText={(v) => onEmailChange(i, v)}
              error={emailErrors[i]}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </Box>
          {emails.length > 2 && (
            <TouchableOpacity onPress={() => onRemoveEmail(i)}>
              <X
                size={20}
                color={theme.colors.textTertiary}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          )}
        </Box>
      ))}
      {emails.length < 10 && (
        <Box alignItems="center" marginTop="s">
          <TouchableOpacity
            onPress={onAddEmail}
            style={{
              backgroundColor: theme.colors.gray100,
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </Box>
      )}
      {error && (
        <Text color="error" marginTop="s">
          {error}
        </Text>
      )}
    </>
  );
};

export default Step2;
