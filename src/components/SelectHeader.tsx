import React, { ReactNode } from "react";
import Link from "./Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface ISelectHeaderProps {
    lastAction?: () => void;
    nextAction?: () => void;
    children?: ReactNode | ReactNode[];
}

const SelectHeader = (props: ISelectHeaderProps) => {
    return (
        <>
            {props.lastAction ? (
                <Link destination={props.lastAction} className="smallIcon">
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Link>
            ) : (
                undefined
            )}

            <span id="monthDisplay">{props.children}</span>

            {props.nextAction ? (
                <Link destination={props.nextAction} className="smallIcon">
                    <FontAwesomeIcon icon={faChevronRight} />
                </Link>
            ) : (
                undefined
            )}
        </>
    );
};

export default SelectHeader;
