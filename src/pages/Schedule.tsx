import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import IPageInterface from "../utils/IPageInterface";

import "../global.css";

class Schedule extends Component<IPageInterface, {}> {
    // document.getElementById("schoolName").innerHTML = schools[selectedSchoolIndex].fullName;
    // document.getElementById("scheduleDisplay").innerHTML = getCurrentScheduleName() + " schedule.";

    // populateScheduleTable();

    //input:  onchange="updateSettings()"
    render() {
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
    }
}

export default connect()(Schedule);
