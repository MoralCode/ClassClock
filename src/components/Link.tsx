import React, { Component, CSSProperties } from "react";

interface ILinkProps {
    destination: any;
    className?: string;
    style?: CSSProperties;
    id?: string;
}

export default class Link extends Component<ILinkProps, {}> {
    render() {
        return (
            <a
                className={this.props.className}
                id={this.props.id}
                style={this.props.style}
                href={
                    typeof this.props.destination === "function"
                        ? undefined
                        : this.props.destination
                }
                onClick={
                    typeof this.props.destination === "function"
                        ? this.props.destination
                        : undefined
                }
            >
                {this.props.children}
            </a>
        );
    }
}
