import { STATUS_LABEL_MAP } from "@/constants/circles";
import { CircleStatusType } from "@/types/api";
import { getStatusVariant } from "@/utils/circles";
import React from "react";
import { Badge } from "./Badge";

type StatusLabelProps = {
  status: CircleStatusType;
};

export const StatusLabel = ({ status }: StatusLabelProps) => (
  <Badge variant={getStatusVariant(status) as any} size="medium">
    {STATUS_LABEL_MAP[status] ?? status}
  </Badge>
);

export default StatusLabel;
