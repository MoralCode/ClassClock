import React, { Component, CSSProperties } from "react";

interface ITextProps {
    className?: string;
    style?: CSSProperties;
}
export default class Text extends Component<ITextProps, {}> {
    render() {
        return (
            <span
                className={
                    "blockInfo" + (this.props.className ? " " + this.props.className : "")
                }
                style={this.props.style}
            >
                {this.props.children}
            </span>
        );
    }
}
