import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../../global.css";
import "./SelectionList.css";

import { selectSchool } from "../../store/schools/actions";
import { useAuth0 } from "../../react-auth0-wrapper";
import School from "../../@types/school";
import ClassClockService from "../../services/classclock";
import { pages } from "../../utils/constants";
import { IState } from "../../store/schools/types";

export interface ISelectProps {
    title: string;
}

const SelectionList = (props: ISelectProps) => {


    return (
        <div>
            {schoolList.length === 0 ? (
            <h2>{props.title}</h2>
                <span>Loading...</span>
            ) : (
                <ul className="selectionList">{list}</ul>
            )}

            {/* <a onClick={}>Refresh</a> */}
        </div>
    );
};

export default SelectionList;