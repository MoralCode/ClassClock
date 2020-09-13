import React, { Component } from "react";

interface IIconProps {
    icon: string;
}

const Icon = (props: IIconProps) => {
    return <i className={"fas " + props.icon} />;
}

export default Icon;