import React, { Component } from "react";

interface IIconProps {
    icon: string;
    regularStyle?:boolean
}

const Icon = (props: IIconProps) => {
    const style = props.regularStyle? "far ": "fas ";
    return <i className={style + props.icon} />;
}

export default Icon;