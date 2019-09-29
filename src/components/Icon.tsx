import React, { Component } from "react";

interface IIconProps {
    icon: string;
}

export default class Icon extends Component<IIconProps, {}> {
    render() {
        return <i className={"fas " + this.props.icon} />;
    }
}
