import React from "react";

export interface IListProps {
    items: JSX.Element[];
}

const List = (props: IListProps) => {
    return <div>{props.items}</div>;
};

export default List;
