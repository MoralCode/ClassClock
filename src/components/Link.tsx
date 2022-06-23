import React, { Component, CSSProperties, ReactNode } from "react";

export interface ILinkProps {
    destination: any;
    className?: string;
    style?: CSSProperties;
    title?: string;
    id?: string;
    children?: ReactNode | ReactNode[];
}

const Link = (props: ILinkProps) => {

    return (
        <a
            className={props.className}
            id={props.id}
            style={Object.assign({}, props.style, { cursor: "pointer" })}
            title={props.title}
            href={
                typeof props.destination === "function"
                    ? undefined
                    : props.destination
            }
            onClick={
                typeof props.destination === "function"
                    ? props.destination
                    : undefined
            }
        >
            {props.children}
        </a>
    );
}

export default Link;
