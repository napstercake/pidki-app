import React from "react";
import ListItem, { ListItemProps } from "./ListItem";

interface ListProps {
  items: ListItemProps[];
}

const List: React.FC<ListProps> = ({ items }) => {
  return (
    <>
      {items.map((item, index) => (
        <ListItem key={item.id} {...item} isLast={index === items.length - 1} />
      ))}
    </>
  );
};

export default List;
