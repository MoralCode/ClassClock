import React, { Component, ReactNode } from "react";

interface IStatusIndicatorProps {
    color: string;
    children?: ReactNode | ReactNode[];
}

const StatusIndicator = (props: IStatusIndicatorProps) => {
    const size = "15px"
    return <span className="statusIndicator cornerNavBottom cornerNavLeft" style={{backgroundColor: props.color}}>
        {props.children}
    </span>;
}

export default StatusIndicator;