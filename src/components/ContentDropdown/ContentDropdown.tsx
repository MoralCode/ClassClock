import React, { ReactNode } from "react";

export interface IContentDropdownProps {
	summary: JSX.Element[] | string;
	children?: ReactNode;
}

const ContentDropdown = (props: IContentDropdownProps) => {
    return (
        <details>
            <summary>{props.summary}</summary>
            <>{props.children}</>
        </details>
    );
};

export default ContentDropdown;
