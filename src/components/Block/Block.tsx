import React, { Component, CSSProperties } from "react";
import "./Block.css";

interface ITextProps {
    className?: string;
    style?: CSSProperties;
}

/**
 * A block represents a single piece of information in the main classclock app interface, such as the time left in this class, what the next class is, what the current class is .etc
 */
export default class Block extends Component<ITextProps, {}> {
    render() {
        return (
            <div
                className={
                    "infoBlock" + (this.props.className ? " " + this.props.className : "")
                }
                style={this.props.style}
            >
                {this.props.children}
            </div>
        );
    }
}
