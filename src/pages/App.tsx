import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import Link from "../components/Link";
import Icon from "../components/Icon";
import Text from "../components/Text";
import Time from "../@types/time";
import School from "../@types/school";
import { pages } from "../utils/constants";
import BellSchedule from "../@types/bellschedule";
import { IState } from "../store/schools/types";

export interface IAppProps {
    selectedSchool: any;
    dispatch: any;
}

const App = (props: IAppProps) => {
    const [currentDate, setDate] = useState(new Date());

    const navigate = (to: string) => {
        props.dispatch(push(to));
    };

    useEffect(() => {
        const interval: NodeJS.Timeout = setInterval(() => {
            setDate(new Date());
        }, 500);

        // if (
        //     props.selectedSchool === undefined ||
        //     props.selectedSchool.getScheduleForDate(currentDate) === undefined
        // ) {
        //     props.dispatch(push(pages.selectSchool));
        // }

        return () => clearInterval(interval);
    }, [currentDate]);

    // //this is causing a loop
    // const forceDefined = (value: any) => {
    //     if (value === undefined) {
    //
    //     } else {
    //         return value;
    //     }
    // };

    // const currentSchedule: BellSchedule = props.selectedSchool.getScheduleForDate(
    //     currentDate
    // );
    // const currentClass = currentSchedule.getClassPeriodForTime(
    //     Time.fromDate(currentDate)
    // );

    if (props.selectedSchool.isFetching) {
        return <span>Loading...</span>;
    } else if (props.selectedSchool.data.getScheduleForDate(currentDate) === undefined) {
        props.dispatch(push(pages.selectSchool));
    } else {
        const currentSchedule = props.selectedSchool.data.getScheduleForDate(currentDate);
        const currentClass = currentSchedule.getClassPeriodForTime(
            Time.fromDate(currentDate)
        );
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
                <Text>It is currently: </Text>
                <Text className="timeFont" style={{ fontSize: "40px" }}>
                    {Time.fromDate(currentDate).getFormattedString()}
                </Text>
                <Text>
                    <span>on </span>
                    <b>{currentDate.toLocaleDateString()}</b>
                </Text>
                <section id="scheduleInfo" className="verticalFlex">
                    <Text>{currentSchedule.getName()}</Text>
                    <Text>{props.selectedSchool.getName()}</Text>
                    <Link
                        // tslint:disable-next-line: jsx-no-lambda
                        destination={() => navigate(pages.fullSchedule)}
                        className="centered bottomSpace"
                        id="viewScheduleLink"
                    >
                        View Schedule
                    </Link>
                    <p className="centered label">You are currently in: </p>
                    {/* <h1 className="centered bottomSpace" id="currentClass" /> */}
                    <Text>
                        {currentClass !== undefined
                            ? currentClass.getName()
                            : props.selectedSchool.getPassingTimeName()}
                    </Text>
                    <p className="centered label" id="countdownLabel">
                        ...which ends in:
                    </p>
                    {/* <h1 className="centered bottomSpace time bigger" id="timeToEndOfClass" /> */}
                    <Text>{currentClass !== undefined ? currentClass : "Not Found"}</Text>
                    <p className="centered label">Your next class period is: </p>
                    <h1 className="centered bottomSpace" id="nextClass" />
                </section>
            </div>
        );
    }
};

const mapStateToProps = (state: IState) => ({
    selectedSchool: state.selectedSchool
});

export default connect(mapStateToProps)(App);
