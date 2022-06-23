import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import { getSchoolsList, selectSchool } from "../store/schools/actions";
import School from "../@types/school";
import { pages } from "../utils/constants";
import { ISchoolListState, SchoolListState } from "../store/schools/types";
import SelectionList from "../components/SelectionList/SelectionList";
import { DateTime } from "luxon";
import BlockLink from '../components/BlockLink';

export interface IWelcomeProps {
    dispatch: any;
}

const Welcome = (props: IWelcomeProps) => {
    return (
        <div className="centeredWidth">
            <h2>Welcome to ClassClock!</h2>
            <p>An open source school scheduling assistant built by students.</p>
            <div className="mediumVerticalSpacer"></div>
            <BlockLink destination={() => props.dispatch(push(pages.selectSchool))} title={"Find your Schedules"}>Find your Schedules</BlockLink>
            <br/>
            <BlockLink destination={"https://classclock.app"} title={"Learn more about ClassClock"}>Learn more about ClassClock</BlockLink>
        </div>
    );
};

export default connect()(Welcome);

// export default Welcome;
