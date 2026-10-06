import { Box } from "@/components/authorable/Box";
import { Text } from "@/components/authorable/Text";
import { TextField } from "@/components/authorable/TextField";
import React from "react";

const nameSuggestions = [
  "Vecinos Magdalena",
  "Promoción 2001",
  "Contractors",
  "Familia",
  "Amigos del Gym",
];

type Props = {
  name: string;
  description: string;
  error: string | null;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

const Step4 = ({
  name,
  description,
  error,
  onNameChange,
  onDescriptionChange,
}: Props) => {
  return (
    <Box flex={1}>
      <Box>
        <Text
          variant="titleBold"
          color="text"
          marginBottom="m"
          textAlign="center"
        >
          Personaliza tu círculo
        </Text>
        <Text
          variant="body"
          color="textSecondary"
          marginBottom="l"
          style={{ fontStyle: "italic" }}
          textAlign="center"
        >
          Ponle un nombre y una descripción.
        </Text>
        <TextField
          label="Nombre del círculo"
          placeholder="Ej: Vecinos Magdalena"
          value={name}
          onChangeText={onNameChange}
          helperText={nameSuggestions.join(", ")}
        />
        <TextField
          label="Descripción (opcional)"
          placeholder="Describe tu círculo"
          value={description}
          onChangeText={onDescriptionChange}
          multiline
        />
        {error && (
          <Text color="error" marginTop="s">
            {error}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default Step4;
