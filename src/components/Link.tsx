import React, { Component, CSSProperties } from "react";

interface ILinkProps {
    destination: any;
    className?: string;
    style?: CSSProperties;
    title?: string;
    id?: string;
}

export default class Link extends Component<ILinkProps, {}> {
    render() {
        return (
            <a
                className={this.props.className}
                id={this.props.id}
                style={Object.assign({}, this.props.style, { cursor: "pointer" })}
                title={this.props.title}
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
