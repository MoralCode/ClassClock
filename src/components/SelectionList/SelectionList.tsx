import React, { ReactElement } from "react";
import "../../global.css";
import "./SelectionList.css";

export interface ISelectProps {
    title: string;
    loading: boolean;
    children?: ReactElement[];
}

const SelectionList = (props: ISelectProps) => {

    const makeIntoListItems = (nodeList: ReactElement[] | undefined ) => {
       if (!nodeList || nodeList.length === 0) {
           return (<span>No Items.</span>)
       }

        return nodeList.map((node, index) => {
            if (node.type != "li") {
                // When you don’t have stable IDs for rendered items, you may use the item index as a key as a last resort
                // https://reactjs.org/docs/lists-and-keys.html#keys
                return <li key={index}>{node}</li>
            } else {
                return node
            }
        })

    };


    return (
        <div>
            <h2>{props.title}</h2>
            {props.loading? (
                <span>Loading...</span>
            ) : (
                    <ul className="selectionList">
                        {makeIntoListItems(props.children)}
                    </ul>
            )}

            {/* <a onClick={}>Refresh</a> */}
        </div>
    );
};

export default SelectionList;