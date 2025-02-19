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

export interface IAppProps {
    selectedSchool: {
        isFetching: boolean;
        didInvalidate: boolean;
        data: School;
    };
    dispatch: any;
}

export const Schedule = (props: IAppProps) => {
    let content: JSX.Element = <></>;
    const currentSchedule = props.selectedSchool?.data?.getScheduleForDate(
        getCurrentDate()
    );

    switch (currentSchedule) {
        case undefined:
            props.dispatch(push(pages.selectSchool));
            break;
        case null:
            content = <p>No School Today</p>;
            break;
        default:
            content = (
                <>
                    <p>{currentSchedule.getName()}</p>
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
                </>
            );
            break;
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
