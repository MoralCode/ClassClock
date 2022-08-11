import React, { ReactNode } from "react";
import StopLight from "./StopLight";

interface IStatusIndicatorProps {
    color: string;
    children?: ReactNode | ReactNode[];
}

const StatusIndicator = (props: IStatusIndicatorProps) => {
    const size = "15px"
    return <span className="statusIndicator cornerNavBottom cornerNavLeft" >
        <StopLight color={props.color} />
        {props.children}
    </span>;
}

export default StatusIndicator;