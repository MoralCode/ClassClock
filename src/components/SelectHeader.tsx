import React from "react";
import Link from "./Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface ISelectHeaderProps {
    lastAction?: () => void;
    nextAction?: () => void;
    content: string;
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

            <span id="monthDisplay">{props.content}</span>

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
