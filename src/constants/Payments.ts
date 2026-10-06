export const PAYMENT_PERIOD = {
  weekly: "WEEKLY",
  biWeekly: "BIWEEKLY",
  monthly: "MONTHLY",
};

export const PAYMENT_CONSTANTS = {
  WEEKLY: {
    label: "Semanal",
    value: PAYMENT_PERIOD.weekly,
    days: 7,
    description: "Cada 7 días",
  },
  BIWEEKLY: {
    label: "Quincenal",
    value: PAYMENT_PERIOD.biWeekly,
    days: 15,
    description: "Cada 15 días",
  },
  MONTHLY: {
    label: "Mensual",
    value: PAYMENT_PERIOD.monthly,
    days: 30,
    description: "Cada 30 días",
  },
};

export const PAYMENT_PERIOD_OPTIONS = [
  {
    label: PAYMENT_CONSTANTS.WEEKLY.label,
    value: PAYMENT_CONSTANTS.WEEKLY.value,
    days: PAYMENT_CONSTANTS.WEEKLY.days,
    description: PAYMENT_CONSTANTS.WEEKLY.description,
  },
  {
    label: PAYMENT_CONSTANTS.BIWEEKLY.label,
    value: PAYMENT_CONSTANTS.BIWEEKLY.value,
    days: PAYMENT_CONSTANTS.BIWEEKLY.days,
    description: PAYMENT_CONSTANTS.BIWEEKLY.description,
  },
  {
    label: PAYMENT_CONSTANTS.MONTHLY.label,
    value: PAYMENT_CONSTANTS.MONTHLY.value,
    days: PAYMENT_CONSTANTS.MONTHLY.days,
    description: PAYMENT_CONSTANTS.MONTHLY.description,
  },
];
