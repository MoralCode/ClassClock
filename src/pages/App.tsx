import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import Link from "../components/Link";
import Icon from "../components/Icon";
import Block from "../components/Block/Block";
import Time from "../@types/time";
import School from "../@types/school";
import { pages } from "../utils/constants";
import BellSchedule from "../@types/bellschedule";
import { IState } from "../store/schools/types";
import { getNextImportantTime, getCurrentDate } from "../utils/helpers";

export interface IAppProps {
    selectedSchool: {
        isFetching: boolean;
        didInvalidate: false;
        data: School;
    };
    dispatch: any;
}

const App = (props: IAppProps) => {
    const [currentDate, setDate] = useState(getCurrentDate());

    const navigate = (to: string) => {
        props.dispatch(push(to));
    };

    useEffect(() => {
        const interval: NodeJS.Timeout = setInterval(() => {
            setDate(getCurrentDate());
        }, 500);

        return () => clearInterval(interval);
    }, [currentDate]);

    const currentSchedule = props.selectedSchool.data.getScheduleForDate(currentDate);

    let content: JSX.Element = <></>;

    switch (currentSchedule) {
        case undefined:
            props.dispatch(push(pages.selectSchool));
            break;
        case null:
            content = <p>No School Today</p>;
            break;
        default:
            const nextImportantInfo = getNextImportantTime(
                currentDate,
                props.selectedSchool.data
            );
            const [nextClass, nextImportantTime] = nextImportantInfo
                ? nextImportantInfo
                : [undefined, undefined];

            const currentClass = currentSchedule.getClassPeriodForTime(
                Time.fromDate(currentDate)
            );

            content = (
                <>
                    <Block>
                        <p>
                            Today is a{" "}
                            <Link
                                // tslint:disable-next-line: jsx-no-lambda
                                destination={() => navigate(pages.fullSchedule)}
                                id="viewScheduleLink"
                            >
                                {currentSchedule.getName()}
                            </Link>
                        </p>
                    </Block>
                    <Block>
                        <p>You are currently in: </p>
                        <p className="timeFont" style={{ fontSize: "30px" }}>
                            <b>
                                {currentClass !== undefined
                                    ? currentClass.getName()
                                    : props.selectedSchool.data.getPassingTimeName()}
                            </b>
                        </p>
                    </Block>
                    <Block>
                        <p>...which ends in:</p>
                        {/* <h1 className="centered bottomSpace time bigger" id="timeToEndOfClass" /> */}
                        <p className="timeFont" style={{ fontSize: "60px" }}>
                            <b>
                                {nextImportantTime !== undefined
                                    ? Time.fromDate(currentDate)
                                          .getTimeDeltaTo(nextImportantTime)
                                          .getFormattedString()
                                    : "No Class"}
                            </b>
                        </p>
                        <p>Your next class period is: </p>
                        <p className="timeFont" style={{ fontSize: "30px" }}>
                            <b>
                                {nextClass !== undefined
                                    ? nextClass.getName()
                                    : "No Class"}
                            </b>
                        </p>
                    </Block>
                </>
            );
            break;
    }

    return (
        <div className="App">
            <Link
                className="cornerNavButton smallIcon"
                // tslint:disable-next-line: jsx-no-lambda
                destination={() => navigate(pages.settings)}
            >
                <Icon icon="fa-cog" />
            </Link>
            <br />
            <Block>
                <p>It is currently: </p>
                <p className="timeFont" style={{ fontSize: "40px" }}>
                    {Time.fromDate(currentDate).getFormattedString()}
                </p>
                <p>
                    on{" "}
                    <b>
                        {currentDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })}
                    </b>
                </p>
            </Block>

            {content}
        </div>
    );
};

const mapStateToProps = (state: IState) => {
    const { selectedSchool } = state;
    selectedSchool.data = School.fromJson(selectedSchool.data);
    return { selectedSchool };
};

export default connect(mapStateToProps)(App);
