import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import Link from "../components/Link";
import Block from "../components/Block/Block";
import { DateTime } from "luxon";
import School from "../@types/school";
import { pages } from "../utils/constants";
import { ISchoolsState, SelectedSchoolState } from "../store/schools/types";
import { getCurrentDate } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { ISettingsState, IUserSettings } from "../store/usersettings/types";
import StatusIndicator from "../components/StatusIndicator";
import ClassClockService from "../services/classclock";
import { selectSchool } from "../store/schools/actions";
import ClassPeriod from "../@types/classperiod";
import Time from "../@types/time";

export interface IAppProps {
    selectedSchool: SelectedSchoolState;
    userSettings: IUserSettings;
    error: string;
    dispatch: any;
}

export const App = (props: IAppProps) => {
    const [currentDate, setDate] = useState(getCurrentDate());
    const [online, setOnline] = useState(true);
    const [connected, setConnected] = useState(false);

    const navigate = (to: string) => {
        props.dispatch(push(to));
    };

    const updateConnectionState = () => {
        ClassClockService.isReachable().then((reachable) => {
            setConnected(reachable)
        })
    }

    useEffect(() => {
        const timingInterval: NodeJS.Timeout = setInterval(() => {
            setDate(getCurrentDate());
        }, 500);

        //set the connected state immediately on pageload
        updateConnectionState()

        //then schedule the connection state to be updated every 2 min
        const connectivityInterval: NodeJS.Timeout = setInterval(() => {
            updateConnectionState()
        }, 120000);

        //check when the schedule was last updated
        const dataAge = DateTime.local().toMillis() - props.selectedSchool.lastUpdated
                
        // if data is > 12 hours old 43200000
        if (dataAge > 43200000){
            props.dispatch(selectSchool(props.selectedSchool.data.getIdentifier()))
        }

        return () => {
            clearInterval(timingInterval)
            clearInterval(connectivityInterval)
        };
    }, []);

    window.addEventListener('online', () => {
        setOnline(true)
        updateConnectionState()
    });
    window.addEventListener('offline', () => {setOnline(false)});

    //If this is not present here, then there will be an error when the next lines run in the event data is being fetched and there is no stored school.
    // this guards against trying to call a function on an empty data object which may be present if the school is being fetched for the first time.
    if (props.selectedSchool.isFetching) {
        return <p>Fetching...</p>
    }
    const currentSchedule = props.selectedSchool.data.getScheduleForDate(currentDate);
    const schoolTimezone = props.selectedSchool.data.getTimezone();

    const getContent = () => {
        switch (currentSchedule) {
            case undefined:
                if (!props.selectedSchool.isFetching) {
                    props.dispatch(push(pages.welcome));
                }
                return
            case null:
                return <p>No School Today</p>;
            default:

                let nextClass: ClassPeriod | undefined = currentSchedule.getClassStartingAfter(currentDate, schoolTimezone);
                let nextImportantTime: Time | undefined;

                const currentClass = currentSchedule.getClassPeriodForTime(currentDate, schoolTimezone);

                if (currentClass){
                    nextImportantTime = currentClass.getEndTime()
                } else if (nextClass) {
                    nextImportantTime = nextClass.getStartTime()
                } else {
                    return <p>School's Out!</p>;
                }

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
                                        ? nextImportantTime.getTimeDeltaTo(Time.fromDateTime(currentDate, props.selectedSchool.data.getTimezone())).getFormattedString(false, true)
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

    const getStatus = () => {
        let content: JSX.Element = <></>;
        let color = "";

        if (props.selectedSchool.isFetching){
            color = "yellow";
            content = <>Refreshing...</>
        } else if (props.error != "") {
            color = "red";
            content = <>Error</>
        } else if (!online) {
            color = "orange";
            content = <>Offline</>
        } else {
            content =  connected? <>Connected</> : <>Online</>;
            color = "green";
        }

        return <StatusIndicator color={color}>{content}</StatusIndicator>
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
        {getStatus()}
        </>
    );
};

const mapStateToProps = (state: ISchoolsState & ISettingsState & {error: string}) => {
    const { selectedSchool, userSettings, error } = state;
    return { selectedSchool, userSettings, error };
};

export default connect(mapStateToProps)(App);
