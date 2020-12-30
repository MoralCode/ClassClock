import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import { selectSchool } from "../store/schools/actions";
import School from "../@types/school";
import ClassClockService from "../services/classclock";
import { pages } from "../utils/constants";
import { ISchoolsState } from "../store/schools/types";
import SelectionList from "../components/SelectionList/SelectionList";

export interface ISelectProps {
    selectedSchool: any;
    error: string;
    dispatch: any;
}

const SchoolSelect = (props: ISelectProps) => {
    const [schoolList, setSchoolList] = useState([]);
    const [lastRefresh, setlastRefresh] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (
            isFetching() &&
            Math.abs(new Date().getTime() - lastRefresh) > 120000 //120000 ms = 2 min
        ) {
            const fetchSchools = async (abortSignal: AbortSignal) => {
                ClassClockService.validateResponse(
                    ClassClockService.getSchoolsList({
                        signal: abortSignal
                    })
                ).then((json: any) => {
                    setSchoolList(
                        json.data.map((value: any) =>
                            School.fromJson(value)
                        )
                    );

                    setlastRefresh(new Date().getTime());
                });
            };
            fetchSchools(signal);
        }

        return () => {
            controller.abort();
        };
    }, []);


     //schoolList.length is used here because the app can potentially get stuck on isFetching = true if, for example, the page gets closed while a request is in progress. maybe mitigate this with a timestamp of when the requet started and add a timeout to change it back to false automatically?
    const isFetching = () => schoolList.length === 0
    // props.selectedSchool.isFetching === false

    const list = schoolList.map((school: School) => (
        <li
            key={school.getIdentifier()}
            onClick={() => {
                props.dispatch(selectSchool(school.getIdentifier()));
                props.dispatch(push(pages.main));
            }}
        >
            <span className="schoolAcronym">{school.getAcronym()}</span>
            <br />
            <span className="schoolName">{school.getName()}</span>
        </li>
    ));

    return (
        <SelectionList title="Please select a school" loading={isFetching()} error={props.error} className="centeredWidth" >
            {list}
        </SelectionList>
    );
};

const mapStateToProps = (state: ISchoolsState & { error: string }) => {
    const { selectedSchool, error } = state;
    return { selectedSchool, error };
};
export default connect(mapStateToProps)(SchoolSelect);
