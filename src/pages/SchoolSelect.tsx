import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import { selectSchool } from "../store/schools/actions";
import School from "../@types/school";
import ClassClockService from "../services/classclock";
import { pages } from "../utils/constants";
import { IState } from "../store/schools/types";
import SelectionList from "../components/SelectionList/SelectionList";

export interface ISelectProps {
    selectedSchool: any;
    dispatch: any;
}

const SchoolSelect = (props: ISelectProps) => {
    const [schoolList, setSchoolList] = useState([]);
    const [lastRefresh, setlastRefresh] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (
            schoolList.length === 0 &&
            // isFetching === false &&
            Math.abs(new Date().getTime() - lastRefresh) > 120000 //120000 ms
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
        <SelectionList title="Please select a school" loading={schoolList.length === 0} >
            {list}
        </SelectionList>
    );
};

const mapStateToProps = (state: IState) => {
    const { selectedSchool } = state;
    return { selectedSchool };
};
export default connect(mapStateToProps)(SchoolSelect);
