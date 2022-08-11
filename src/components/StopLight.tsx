import React from "react";

interface IStopLightProps {
    color: string;
}

const StopLight = (props: IStopLightProps) => {
    const size = "15px"
    return <i className="circle"  style={{width: size, height: size, backgroundColor: props.color}}></i>;
}

export default StopLight;