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

const App = (props: { selectedSchool: School; dispatch: any }) => {
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
                <b>Thurs, Jan 12, 2019</b>
            </Text>
            <section id="scheduleInfo" className="verticalFlex">
                {/* <p className="centered" id="schedule" /> */}
                {/* <Text>{props.selectedSchool.getScheduleForDate(currentDate).getName()}</Text> */}
                {/* <Text>{props.selectedSchool.data.fullName}</Text> */}
                <Link
                    // tslint:disable-next-line: jsx-no-lambda
                    destination={() => navigate(pages.fullSchedule)}
                    className="centered bottomSpace"
                    id="viewScheduleLink"
                >
                    View Schedule
                </Link>
                <p className="centered label">You are currently in: </p>
                <h1 className="centered bottomSpace" id="currentClass" />
                <p className="centered label" id="countdownLabel">
                    ...which ends in:
                </p>
                <h1 className="centered bottomSpace time bigger" id="timeToEndOfClass" />
                <p className="centered label">Your next class period is: </p>
                <h1 className="centered bottomSpace" id="nextClass" />
            </section>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    const { selectedSchool } = state;
    return { selectedSchool: School.fromState(selectedSchool.data) };
};
export default connect(mapStateToProps)(App);
