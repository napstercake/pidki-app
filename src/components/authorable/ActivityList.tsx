import theme from "@/theme";
import { ActivityType, FeedItem } from "@/types/api";
import { formatCurrency } from "@/utils/common";
import { TrendingUp } from "lucide-react-native";
import React from "react";
import ActivityListItem, {
  ActivityListItemData,
  ActivityListItemType,
} from "./ActivityListItem";
import { Box } from "./Box";
import { Text } from "./Text";

const ACTION_TYPE_MAP: Record<
  ActivityType,
  { title: string; type: ActivityListItemType }
> = {
  CIRCLE_CREATED: { title: "Círculo creado", type: "success" },
  CIRCLE_READY_TO_DRAW: { title: "Listo para sortear", type: "warning" },
  CIRCLE_DRAW_COMPLETED: { title: "Sorteo realizado", type: "success" },
  CIRCLE_ACTIVATED: { title: "Círculo activado", type: "success" },
  CIRCLE_COMPLETED: { title: "Círculo completado", type: "success" },
  CIRCLE_CANCELLED: { title: "Círculo cancelado", type: "warning" },
  MEMBER_JOINED: { title: "Nuevo miembro", type: "success" },
  MEMBER_LEFT: { title: "Miembro salió", type: "warning" },
  MEMBER_INVITED: { title: "Invitación recibida", type: "action" },
  PAYMENT_MADE: { title: "Pago realizado", type: "success" },
  PAYMENT_OVERDUE: { title: "Pago vencido", type: "warning" },
  PAYMENT_RECEIVED: { title: "Pago recibido", type: "success" },
};

function feedItemToActivityListItem(item: FeedItem): ActivityListItemData {
  const { title, type } = ACTION_TYPE_MAP[item.actionType] ?? {
    title: item.actionType,
    type: "success" as ActivityListItemType,
  };

  const actorName = `${item.actor.firstName} ${item.actor.lastName}`.trim();
  const subtitle = `${actorName} • ${item.circle.name}`;

  const isPayment =
    item.actionType === "PAYMENT_MADE" ||
    item.actionType === "PAYMENT_RECEIVED";

  const amount =
    isPayment && typeof item.metadata?.amount === "number"
      ? formatCurrency(item.metadata.amount as number, false)
      : undefined;

  const amountPositive = item.actionType === "PAYMENT_RECEIVED";

  const actionLabel =
    item.actionType === "MEMBER_INVITED" ? "Revisar" : undefined;

  return {
    id: item.id,
    type,
    title,
    subtitle,
    amount,
    amountPositive,
    actionLabel,
    onActionPress: actionLabel ? () => {} : undefined,
  };
}

interface ActivityListProps {
  items: FeedItem[];
}

const ActivityList: React.FC<ActivityListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <Box alignItems="center" paddingVertical="xl">
        <TrendingUp size={48} color={theme.colors.textTertiary} />
        <Text
          variant="body"
          color="textSecondary"
          textAlign="center"
          marginTop="m"
        >
          No hay actividad reciente
        </Text>
      </Box>
    );
  }

  const listItems = items.map(feedItemToActivityListItem);

  return (
    <Box>
      {listItems.map((item, index) => (
        <ActivityListItem
          key={item.id}
          {...item}
          isLast={index === listItems.length - 1}
        />
      ))}
    </Box>
  );
};

export default ActivityList;
