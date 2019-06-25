import React, { Component } from 'react';

class Schedule extends Component {
   
    // document.getElementById("schoolName").innerHTML = schools[selectedSchoolIndex].fullName;
    // document.getElementById("scheduleDisplay").innerHTML = getCurrentScheduleName() + " schedule.";

    // populateScheduleTable();


    //input:  onchange="updateSettings()"
    render() {
        return (
            <div>
                <a className="navbutton" href="index.html"><i className="fas fa-home" /></a>
                <br />
                <h1 className="centered topSpace bottomSpace" id="schoolName" />
                <p className="centered bottomSpace" id="scheduleDisplay" />
                <table id="scheduleTable" className="centeredInline topSpace" />
            </div>
        );
    }
}