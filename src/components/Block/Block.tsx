import React, { Component, CSSProperties } from "react";
import "./Block.css";

interface ITextProps {
    className?: string;
    style?: CSSProperties;
}
export default class Block extends Component<ITextProps, {}> {
    render() {
        return (
            <div
                className={
                    "blockInfo" + (this.props.className ? " " + this.props.className : "")
                }
                style={this.props.style}
            >
                {this.props.children}
            </div>
        );
    }
}
