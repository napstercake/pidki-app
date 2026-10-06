export const CIRCLE_STATUS = {
  pending: "PENDING",
  active: "ACTIVE",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
  readyToDraw: "READY_TO_DRAW",
};

export const CIRCLE_INVITATION = {
  pending: "PENDING",
  accepted: "ACCEPTED",
  declined: "DECLINED",
};

export const CIRCLE_PAYMENT = {
  pending: "PENDING",
  paid: "PAID",
};

export const PARTICIPANTS = {
  min: 3,
  max: 12,
};

export const GOAL_AMOUNT = {
  min: 300,
  max: 5000,
  step: 50,
  default: 1000,
};

export const PROGRESS_LABEL_MAP: Record<string, string> = {
  [CIRCLE_STATUS.pending]: "Setup",
  [CIRCLE_STATUS.readyToDraw]: "Ready",
  [CIRCLE_STATUS.active]: "Progress",
  [CIRCLE_STATUS.completed]: "Completed",
  [CIRCLE_STATUS.cancelled]: "Cancelled",
};

export const PROGRESS_COLOR_MAP: Record<string, string> = {
  [CIRCLE_STATUS.pending]: "warning",
  [CIRCLE_STATUS.readyToDraw]: "accent",
  [CIRCLE_STATUS.active]: "success",
  [CIRCLE_STATUS.completed]: "primary",
  [CIRCLE_STATUS.cancelled]: "error",
};

export const STATUS_VARIANT_MAP: Record<string, string> = {
  [CIRCLE_STATUS.pending]: "secondary",
  [CIRCLE_STATUS.readyToDraw]: "warning",
  [CIRCLE_STATUS.active]: "success",
  [CIRCLE_STATUS.completed]: "primary",
  [CIRCLE_STATUS.cancelled]: "error",
};

export const STATUS_LABEL_MAP: Record<string, string> = {
  [CIRCLE_STATUS.pending]: "Pendiente",
  [CIRCLE_STATUS.readyToDraw]: "Por sortear",
  [CIRCLE_STATUS.active]: "Activo",
  [CIRCLE_STATUS.completed]: "Completado",
  [CIRCLE_STATUS.cancelled]: "Cancelado",
};

export const MAX_VISIBLE_AVATARS = 3;

export const ROUND_TEXTS = {
  1: "Primera",
  2: "Segunda",
  3: "Tercera",
  4: "Cuarta",
  5: "Quinta",
  6: "Sexta",
  7: "Séptima",
  8: "Octava",
  9: "Novena",
  10: "Décima",
  11: "Onceava",
  12: "Doceava",
};
