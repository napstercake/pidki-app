import {
    CIRCLE_PAYMENT,
    CIRCLE_STATUS,
    PARTICIPANTS,
    PROGRESS_COLOR_MAP,
    PROGRESS_LABEL_MAP,
    STATUS_VARIANT_MAP,
} from "@/constants/circles";
import { PAYMENT_CONSTANTS } from "@/constants/Payments";
import { Circle, CircleMember, CirclePayment, CircleStatusType } from "@/types/api";

export const calculateProgress = (circle: Circle): number => {
  switch (circle.status) {
    case CIRCLE_STATUS.pending:
      return Math.round(
        Math.min(100, (circle.currentParticipants / PARTICIPANTS.min) * 50),
      );
    case CIRCLE_STATUS.readyToDraw:
      return 0;
    case CIRCLE_STATUS.active: {
      const total = circle.currentParticipants;
      const completed = Math.floor(Math.random() * total);
      return Math.round((completed / total) * 100);
    }
    case CIRCLE_STATUS.completed:
      return 100;
    case CIRCLE_STATUS.cancelled:
      return 0;
    default:
      return 0;
  }
};

export const getProgressLabel = (circle: Circle): string =>
  PROGRESS_LABEL_MAP[circle.status] ?? "Progress";

export const getRoundProgress = (circle: Circle) => ({
  current: circle.payments.filter((p) => p.status === CIRCLE_PAYMENT.paid)
    .length,
  total: circle.targetParticipants ?? circle.currentParticipants,
});

export const getProgressColor = (circle: Circle): string =>
  PROGRESS_COLOR_MAP[circle.status] ?? "primary";

export const getStatusVariant = (status: CircleStatusType): string =>
  STATUS_VARIANT_MAP[status] ?? "secondary";

export const getPaymentPeriodText = (period: string): string =>
  PAYMENT_CONSTANTS[period as keyof typeof PAYMENT_CONSTANTS]?.label ?? "";

export const getCurrentPendingPayment = (circle: Circle): CirclePayment | undefined => {
  if (circle.status !== CIRCLE_STATUS.active) return undefined;
  return circle.payments.find((p) => p.status === CIRCLE_PAYMENT.pending);
};

export const isLastRound = (circle: Circle): boolean => {
  const currentPayment = getCurrentPendingPayment(circle);
  if (!currentPayment) return false;

  const pendingPayments = circle.payments.filter(
    (p) => p.status === CIRCLE_PAYMENT.pending,
  );
  return (
    pendingPayments.length === 1 &&
    pendingPayments[0].roundNumber === currentPayment.roundNumber
  );
};

export const getPaymentStatusForMember = (circle: Circle, member: CircleMember) => {
  if (circle.status !== CIRCLE_STATUS.active) return null;

  const payment = circle.payments.find(
    (p) => p.recipientUserId === member.userId,
  );
  if (!payment) return null;

  return {
    status: payment.status.toLowerCase(),
    dueDate: new Date(payment.dueDate),
    paidAt: payment.paidAt ? new Date(payment.paidAt) : null,
    roundNumber: payment.roundNumber,
    totalAmount: payment.totalAmount,
  };
};
