import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import IPageInterface from "../utils/IPageInterface";

import "../global.css";
import School from "../@types/school";
import { IState } from "../store/schools/types";
import Link from "../components/Link";
import { pages } from "../utils/constants";
import Icon from "../components/Icon";

export interface IAppProps {
    selectedSchool: {
        isFetching: boolean;
        didInvalidate: false;
        data: School;
    };
    dispatch: any;
}

const Schedule = (props: IAppProps) => {
    // document.getElementById("schoolName").innerHTML = schools[selectedSchoolIndex].fullName;
    // document.getElementById("scheduleDisplay").innerHTML = getCurrentScheduleName() + " schedule.";

    // populateScheduleTable();

    //input:  onchange="updateSettings()"

    return (
        <div>
            <a className="navbutton" href="index.html">
                <i className="fas fa-home" />
            </a>
            <br />
            <h1 className="centered topSpace bottomSpace" id="schoolName" />
            <p className="centered bottomSpace" id="scheduleDisplay" />
            <table id="scheduleTable" className="centeredInline topSpace" />
        </div>
    );
};

const mapStateToProps = (state: IState) => {
    const { selectedSchool } = state;
    selectedSchool.data = School.fromJson(selectedSchool.data);
    return { selectedSchool };
};

export default connect(mapStateToProps)(Schedule);
