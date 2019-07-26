import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import Link from "../components/Link";
import Icon from "../components/Icon";
import Text from "../components/Text/Text";
import Time from "../@types/time";
import School from "../@types/school";
import { pages } from "../utils/constants";
import BellSchedule from "../@types/bellschedule";
import { IState } from "../store/schools/types";

export interface IAppProps {
    selectedSchool: {
        isFetching: boolean;
        didInvalidate: false;
        data: School;
    };
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

        return () => clearInterval(interval);
    }, [currentDate]);

    const currentSchedule = props.selectedSchool.data.getScheduleForDate(currentDate);

    if (props.selectedSchool.isFetching) {
        return <span>Loading...</span>;
    } else if (currentSchedule === undefined) {
        if (props.selectedSchool.data.hasSchedules()) {
            return <span>No School Today</span>;
        } else {
            props.dispatch(push(pages.selectSchool));
            return <span>Error</span>; //this is just here to ensure that this branch of code returns an Element so that there isnt a big nasty typescript error
        }
    } else {
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
                    <Text>{props.selectedSchool.data.getName()}</Text>
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
                            : props.selectedSchool.data.getPassingTimeName()}
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

const mapStateToProps = (state: IState) => {
    const { selectedSchool } = state;
    selectedSchool.data = School.fromJson(selectedSchool.data);
    return { selectedSchool };
};

export default connect(mapStateToProps)(App);
