import {
  CIRCLE_INVITATION,
  CIRCLE_PAYMENT,
  CIRCLE_STATUS,
} from "@/constants/circles";

export type CircleStatusType =
  (typeof CIRCLE_STATUS)[keyof typeof CIRCLE_STATUS];
export type CircleInvitationStatusType =
  (typeof CIRCLE_INVITATION)[keyof typeof CIRCLE_INVITATION];
export type CirclePaymentStatusType =
  (typeof CIRCLE_PAYMENT)[keyof typeof CIRCLE_PAYMENT];

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  totalRatings: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Circle {
  id: string;
  name: string;
  description?: string;
  goalAmount: number;
  paymentAmount: number;
  paymentPeriod: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  status: CircleStatusType;
  currentParticipants: number;
  targetParticipants?: number;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
  members: CircleMember[];
  invitations: CircleInvitation[];
  drawPositions: CircleDrawPosition[];
  payments: CirclePayment[];
}

export interface CircleMember {
  id: string;
  userId: string;
  circleId: string;
  position: number | null;
  joinedAt: string;
  user: User;
}

export interface CircleInvitation {
  id: string;
  circleId: string;
  invitedEmail: string;
  invitedUserId: string | null;
  status: CircleInvitationStatusType;
  invitedAt: string;
  respondedAt: string | null;
  invitedUser: User | null;
  circle?: Circle;
}

export interface CircleDrawPosition {
  id: string;
  circleId: string;
  userId: string;
  position: number;
}

export interface CirclePayment {
  id: string;
  circleId: string;
  roundNumber: number;
  recipientUserId: string;
  totalAmount: number;
  status: CirclePaymentStatusType;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
}

export interface CreateCircleRequest {
  name: string;
  description?: string;
  goalAmount: number;
  paymentPeriod: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  inviteEmails?: string[];
  firstPaymentDueDate?: string; // Added for custom first payment date
}

export interface CreateCircleResponse {
  message: string;
  circle: Circle;
  invitations: number;
}

export interface CirclesResponse {
  circles: Circle[];
}

export interface CircleResponse {
  circle: Circle;
}

export interface InviteUsersRequest {
  userIds: string[];
}

export interface InviteUsersResponse {
  message: string;
  invitations: CircleInvitation[];
}

export interface InvitationsResponse {
  invitations: CircleInvitation[];
}

export interface RemindInvitationsResponse {
  message: string;
  successful: { email: string; invitationId: string; emailSent: boolean }[];
  failed: { email: string; reason: string }[];
}

export interface DrawResponse {
  message: string;
  circleId: string;
}

export type ActivityType =
  | "CIRCLE_CREATED"
  | "CIRCLE_READY_TO_DRAW"
  | "CIRCLE_DRAW_COMPLETED"
  | "CIRCLE_ACTIVATED"
  | "CIRCLE_COMPLETED"
  | "CIRCLE_CANCELLED"
  | "MEMBER_JOINED"
  | "MEMBER_LEFT"
  | "MEMBER_INVITED"
  | "PAYMENT_MADE"
  | "PAYMENT_OVERDUE"
  | "PAYMENT_RECEIVED";

export interface FeedActor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface FeedCircle {
  id: string;
  name: string;
}

export interface FeedItem {
  id: string;
  actionType: ActivityType;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  actor: FeedActor;
  circle: FeedCircle;
}

export interface FeedResponse {
  feed: FeedItem[];
  nextCursor: string | null;
}

export interface ApiError {
  error: string;
  message: string;
}

export interface ValidationError {
  errors: {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
  }[];
}

export interface BankAccount {
  id: string;
  userId: string;
  name: string;
  cc: string;
  cci: string;
  defaultAccount: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccountsResponse {
  success: boolean;
  data: {
    bankAccounts: BankAccount[];
    count: number;
  };
}

export interface BankAccountResponse {
  success: boolean;
  data: {
    bankAccount: BankAccount;
  };
}

export interface BankAccountCreateRequest {
  name: string;
  cc: string;
  cci: string;
  defaultAccount?: boolean;
}

export interface BankAccountUpdateRequest {
  name?: string;
  cc?: string;
  cci?: string;
  defaultAccount?: boolean;
}

export interface BankAccountDeleteResponse {
  success: boolean;
  message: string;
}

export interface RateUserRequest {
  rating: number;
}

export interface RatedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserRating {
  id: string;
  raterId: string;
  ratedUserId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  ratedUser: RatedUser;
}

export interface RateUserResponse {
  success: boolean;
  message: string;
  data: {
    rating: UserRating;
    averageRating: number;
    totalRatings: number;
  };
}
