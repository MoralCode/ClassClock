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

export interface ISelectProps {
    schoolList: SchoolListState;
    error: string;
    dispatch: any;
}

const SchoolSelect = (props: ISelectProps) => {

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const lastUpdate = props.schoolList.lastUpdated || 0

        if (
            
            DateTime.local().toMillis() - lastUpdate > 120000 //120000 ms = 2 min
        ) {
            
            props.dispatch(getSchoolsList(signal))

        }

        return () => {
            controller.abort();
        };
    }, []);


     //schoolList.length is used here because the app can potentially get stuck on isFetching = true if, for example, the page gets closed while a request is in progress. maybe mitigate this with a timestamp of when the requet started and add a timeout to change it back to false automatically?
    const isFetching = () => props.schoolList.isFetching
    // props.selectedSchool.isFetching === false


    const makeSchoolElement = (school:School, dispatch: any) => {
        const id = school.getIdentifier();

        return (<li
            key={id}
            onClick={() => {
                dispatch(selectSchool(id));
                dispatch(push(pages.main));
            }}
        >
            <span className="schoolAcronym">{school.getAcronym()}</span>
            <br />
            <span className="schoolName">{school.getName()}</span>
        </li>)
    }

    let schoolList: JSX.Element[] = [];

    if (props.schoolList && props.schoolList.data) {
        schoolList = props.schoolList.data.map((school) => {
            school = School.fromJson(school);

            return makeSchoolElement(school, props.dispatch)
        })
    }

    return (
        <SelectionList title="Please select a school" loading={isFetching()} error={props.error} className="centeredWidth" >
            {schoolList}    
        </SelectionList>
    );
};

const mapStateToProps = (state: ISchoolListState & { error: string }) => {
    const { schoolList, error } = state;
    return { schoolList, error };
};
export default connect(mapStateToProps)(SchoolSelect);
