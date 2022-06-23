import React, { ReactElement } from "react";
import "../../global.css";
import "./SelectionList.css";

export interface ISelectProps {
    loading: boolean;
    error?: string;
    className?:string;
    children?: ReactElement[];
}

const SelectionList = (props: ISelectProps) => {

    const makeIntoListItems = (nodeList: ReactElement[] | undefined ) => {
       if (!nodeList || nodeList.length === 0) {
           return (<span>No Items.</span>)
       }

        return nodeList.map((node, index) => {
            if (node.type !== "li") {
                // When you don’t have stable IDs for rendered items, you may use the item index as a key as a last resort
                // https://reactjs.org/docs/lists-and-keys.html#keys
                return <li key={index}>{node}</li>
            } else {
                return node
            }
        })

    };

    if (props.loading) {
        return <span>Loading...</span>
    } else if (props.error) {
        return <span>An Error Occurred</span>
    } else {
        return <ul className={"selectionList " + props.className}>
            {makeIntoListItems(props.children)}
        </ul>
    }
};

export default SelectionList;