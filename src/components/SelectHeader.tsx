import React from "react";
import Link from "./Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface ISelectHeaderProps {
    lastAction: () => void;
    nextAction: () => void;
    content: string;
}

const SelectHeader = (props: ISelectHeaderProps) => {
    return (
        <>
            <Link destination={props.lastAction} className="smallIcon">
                <FontAwesomeIcon icon={faChevronLeft} />
            </Link>
            <span id="monthDisplay">{props.content}</span>
            <Link destination={props.nextAction} className="smallIcon">
                <FontAwesomeIcon icon={faChevronRight} />
            </Link>
        </>
    );
};

export default SelectHeader;
