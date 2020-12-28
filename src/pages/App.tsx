import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import Link from "../components/Link";
import Icon from "../components/Icon";
import Block from "../components/Block/Block";
import { DateTime } from "luxon";
import School from "../@types/school";
import { pages } from "../utils/constants";
import BellSchedule from "../@types/bellschedule";
import { ISchoolsState } from "../store/schools/types";
import { getNextImportantInfo, getCurrentDate } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { ISettingsState, IUserSettings } from "../store/usersettings/types";
import StatusIndicator from "../components/StatusIndicator";

export interface IAppProps {
    selectedSchool: {
        isFetching: boolean;
        didInvalidate: boolean;
        data: School;
    };
    userSettings: IUserSettings;
    error: string;
    dispatch: any;
}

export const App = (props: IAppProps) => {
    const [currentDate, setDate] = useState(getCurrentDate());
    const [online, setOnline] = useState(true);

    const navigate = (to: string) => {
        props.dispatch(push(to));
    };

    useEffect(() => {
        const interval: NodeJS.Timeout = setInterval(() => {
            setDate(getCurrentDate());
        }, 500);

        return () => clearInterval(interval);
    }, [currentDate]);

    window.addEventListener('online', () => {setOnline(true)});
    window.addEventListener('offline', () => { setOnline(false)});

    const currentSchedule = props.selectedSchool.data.getScheduleForDate(currentDate);

    const getContent = () => {
        switch (currentSchedule) {
            case undefined:
                if (!props.selectedSchool.isFetching) {
                    props.dispatch(push(pages.selectSchool));
                }
                return
            case null:
                return <p>No School Today</p>;
            default:
                const nextImportantInfo = getNextImportantInfo(
                    currentDate,
                    props.selectedSchool.data
                );
                const [nextClass, nextImportantTime] = nextImportantInfo
                    ? nextImportantInfo
                    : [undefined, undefined];

                const currentClass = currentSchedule.getClassPeriodForTime(currentDate);

                return (
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
                                {nextImportantTime
                                    ? currentDate.until(nextImportantTime)
                                        .toFormat("H:mm")
                                    : "No Class"}
                            </b>
                        </p>
                        <p>Your next class period is: </p>
                        <p className="timeFont" style={{ fontSize: "30px" }}>
                            <b>{nextClass ? nextClass.getName() : "No Class"}</b>
                        </p>
                    </Block>
                    </>
                );
        }
    }

    return (
        <>
        <div className="App">
            <Link
                className="cornerNavButton cornerNavTop cornerNavLeft smallIcon"
                // tslint:disable-next-line: jsx-no-lambda
                destination={() => navigate(pages.settings)}
            >
                <FontAwesomeIcon icon={faCog} />
            </Link>
            <br />
            <Block>
                <p>It is currently: </p>
                <p className="timeFont" style={{ fontSize: "40px" }}>
                    {currentDate.toLocaleString({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !props.userSettings.use24HourTime }) }
                </p>
                <p>
                    on{" "}
                    <b>
                        {currentDate.toLocaleString({
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })}
                    </b>
                </p>
            </Block>

            {getContent()}
        </div>
        <StatusIndicator color="red">hi</StatusIndicator>
        </>
    );
};

const mapStateToProps = (state: ISchoolsState & ISettingsState & {error: string}) => {
    const { selectedSchool, userSettings, error } = state;
    selectedSchool.data = School.fromJson(selectedSchool.data);
    return { selectedSchool, userSettings, error };
};

export default connect(mapStateToProps)(App);
