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
import { ISchoolsState, SelectedSchoolState } from "../store/schools/types";
import { getNextImportantInfo, getCurrentDate } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { ISettingsState, IUserSettings } from "../store/usersettings/types";
import StatusIndicator from "../components/StatusIndicator";
import ClassClockService from "../services/classclock";
import { selectSchool } from "../store/schools/actions";
import ClassPeriod from "../@types/classperiod";

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

    const currentSchedule = props.selectedSchool.data.getScheduleForDate(currentDate);

    const updateConnectionState = () => {
        ClassClockService.isReachable().then((reachable) => {
            setConnected(reachable)
        })
    }

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

                let nextClass: ClassPeriod | undefined = currentSchedule.getClassStartingAfter(currentDate);
                let nextImportantTime: DateTime | undefined;

                const currentClass = currentSchedule.getClassPeriodForTime(currentDate);

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
                                        ? nextImportantTime.diff(currentDate).toFormat("hh:mm:ss")
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
    selectedSchool.data = School.fromJson(selectedSchool.data);
    return { selectedSchool, userSettings, error };
};

export default connect(mapStateToProps)(App);
