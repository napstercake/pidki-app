import React from "react";
import { Box } from "./Box";
import StackListItem, { StackListItemProps } from "./StackListItem";

interface StackListProps {
  items: StackListItemProps[];
}

const StackList: React.FC<StackListProps> = ({ items }) => {
  return (
    <Box gap="m">
      {items.map((item) => (
        <StackListItem key={item.id} {...item} />
      ))}
    </Box>
  );
};

export default StackList;
