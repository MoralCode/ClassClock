import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";

import "../global.css";
import School from "../@types/school";
import { ISchoolsState } from "../store/schools/types";
import Link from "../components/Link";
import { pages } from "../utils/constants";
import { getCurrentDate, sortClassesByStartTime } from "../utils/helpers";
import ClassPeriod from "../@types/classperiod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import BellSchedule from "../@types/bellschedule";

export interface IAppProps {
    selectedSchool: {
        isFetching: boolean;
        didInvalidate: boolean;
        data: School;
    };
    dispatch: any;
}


function getTableForSchedule(currentSchedule: BellSchedule, showAudience:boolean){
    const audience = showAudience? " (" + currentSchedule.getAudience() + ")": "";
    return (
        <div>
            <p>{currentSchedule.getName()}{audience}</p>
            {/* <List items={scheduleItems} /> */}
            <table>
                <thead>
                    <tr>
                        <td>
                            <b>Class</b>
                        </td>
                        <td>
                            <b>Time</b>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {sortClassesByStartTime(currentSchedule.getAllClasses()).map(
                        (value: ClassPeriod) => (
                            <tr key={value.getName() + value.getStartTime().toString()}>
                                <td>{value.getName()}</td>
                                <td>
                                    {value.getStartTime().toString()} -{" "}
                                    {value.getEndTime().toString()}
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}

export const Schedule = (props: IAppProps) => {
    let content: JSX.Element = <></>;
    const currentSchedules = props.selectedSchool?.data?.getSchedulesForDate(
        getCurrentDate()
    );

     if (currentSchedules === undefined) {
        if (!props.selectedSchool.isFetching){
            props.dispatch(push(pages.selectSchool));
        } else {
            console.error("current schedules (therefore selected school) was undefined, yet there was no attempt to fetch")
            return <p>An Error occurred: current schedules (therefore selected school) was undefined, yet there was no attempt to fetch</p>
        }
    } else {
        switch (currentSchedules.length){
            case 0:
                return <p>No School Today</p>;
            case 1:
                const currentSchedule = currentSchedules[0];
                content = getTableForSchedule(currentSchedule, false);
                break;
            default:
                content = <>{currentSchedules.map((schedule) => getTableForSchedule(schedule, true))}</>
        }
    }

    return (
        <div>
            <Link
                className="cornerNavButton cornerNavTop cornerNavLeft smallIcon"
                // tslint:disable-next-line: jsx-no-lambda
                destination={() => props.dispatch(push(pages.main))}
            >
                <FontAwesomeIcon icon={faHome} />
            </Link>
            <br />
            <p style={{ fontSize: "30px" }}>
                <b>{props.selectedSchool.data.getName()}</b>
            </p>

            {content}
        </div>
    );
};

const mapStateToProps = (state: ISchoolsState) => {
    const { selectedSchool } = state;
    return { selectedSchool };
};

export default connect(mapStateToProps)(Schedule);
