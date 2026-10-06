import theme from "@/theme";
import { formatCurrency } from "@/utils/common";
import { Coins, Landmark, PlusCircle } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { Box } from "./Box";
import Gradient from "./Gradient";
import { Text } from "./Text";

type HeroCardProps = {
  label?: string;
  amount: number;
  percentageChange?: number;
  onAddFunds?: () => void;
  onCreate?: () => void;
};

const HeroCard = ({
  label = "TOTAL AHORRADO",
  amount,
  percentageChange,
  onAddFunds,
  onCreate,
}: HeroCardProps) => {
  return (
    <Gradient
      colors={[
        theme.colors.linearGradientPrimary1,
        theme.colors.linearGradientPrimary3,
        theme.colors.linearGradientPrimary2,
      ]}
      style={{
        borderRadius: theme.borderRadii.xl,
        padding: theme.spacing.l,
        marginBottom: theme.spacing.l,
        overflow: "hidden",
      }}
    >
      {/* Decorative circle top-right */}
      <Box
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: "rgba(255,255,255,0.12)",
        }}
      />

      {/* Label row */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="s"
      >
        <Text
          variant="bodyBold"
          style={{
            color: "rgba(255,255,255,0.85)",
            letterSpacing: 1,
          }}
        >
          {label}
        </Text>
        <Landmark size={20} color="rgba(255,255,255,0.7)" />
      </Box>

      {/* Amount + badge */}
      <Box flexDirection="row" alignItems="center" marginBottom="l" gap="s">
        <Text variant="headerBold" style={{ color: "#fff", fontSize: 34 }}>
          {formatCurrency(amount)}
        </Text>
        {percentageChange !== undefined && (
          <Box
            borderRadius="m"
            paddingHorizontal="s"
            paddingVertical="xs"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <Text
              variant="caption"
              style={{ color: "#fff", fontWeight: "700" }}
            >
              {percentageChange >= 0 ? "+" : ""}
              {percentageChange}%
            </Text>
          </Box>
        )}
      </Box>

      {/* Action buttons */}
      <Box flexDirection="row" gap="s">
        <TouchableOpacity onPress={onAddFunds} style={{ flex: 1 }}>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            borderRadius="l"
            paddingVertical="s"
            gap="xs"
            style={{ backgroundColor: theme.colors.gray900 }}
          >
            <Coins size={16} color="#FFF" />
            <Text variant="bodyBold" style={{ color: "#FFF" }}>
              Mis Circulos
            </Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCreate} style={{ flex: 1 }}>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            borderRadius="l"
            paddingVertical="s"
            gap="xs"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <PlusCircle size={16} color="#fff" />
            <Text variant="bodyBold" style={{ color: "#fff" }}>
              Crear
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Gradient>
  );
};

export default HeroCard;
