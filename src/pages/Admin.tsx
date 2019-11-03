import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import School from "../@types/school";
import { pages } from "../utils/constants";
import BellSchedule from "../@types/bellschedule";
import { IState } from "../store/schools/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "../react-auth0-wrapper";
import Calendar, { IScheduleDates } from "../components/Calendar/Calendar";
import { startOfDay } from "date-fns";
import SelectHeader from "../components/SelectHeader";

export interface IAdminProps {
    selectedSchool: {
        isFetching: boolean;
        didInvalidate: false;
        data: School;
    };
    dispatch: any;
}

const Admin = (props: IAdminProps) => {
    const { user, getTokenSilently } = useAuth0();

    const navigate = (to: string) => {
        props.dispatch(push(to));
    };

    const schedules = props.selectedSchool.data.getSchedules();
    // if (
    //     user === undefined ||
    //     props.selectedSchool.data.getOwnerIdentifier() !== user.sub
    // ) {
    //     //user does not own school
    //     navigate(pages.main);
    // }

    //https://stackoverflow.com/a/1484514
    const getRandomHtmlColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getScheduleOptions = () => {
        const optionProps: IScheduleDates = {};
        if (schedules !== undefined) {
            for (const schedule of schedules) {
                optionProps[schedule.getIdentifier()] = {
                    color: getRandomHtmlColor(),
                    name: schedule.getName(),
                    dates: schedule
                        .getDates()
                        .map((value: Date) => startOfDay(value).getTime())
                };
            }
        }
        return optionProps;
    };

    const scheduleOptions = getScheduleOptions();
    const key = [];
    for (const option in scheduleOptions) {
        if (scheduleOptions.hasOwnProperty(option)) {
            key.push(
                <li style={{ backgroundColor: scheduleOptions[option].color }}>
                    {scheduleOptions[option].name}
                </li>
            );
        }
    }

    return (
        <div>
            <h1>Admin</h1>
            <div id="schoolOptions">
                <label>
                    School name:
                    <input
                        type="text"
                        value={props.selectedSchool.data.getName()}
                        // disabled={true}
                        readOnly={true}
                    />
                </label>
                <br />
                <label>
                    School acronym:
                    <input
                        type="text"
                        value={props.selectedSchool.data.getAcronym()}
                        // disabled={true}
                        readOnly={true}
                    />
                </label>
                <br />
                <label>
                    Name of Passing Period:
                    <input
                        type="text"
                        value={props.selectedSchool.data.getPassingTimeName()}
                        onChange={() => {}}
                    />
                </label>
            </div>
            <br />
            <Calendar options={scheduleOptions} />
            <ul
                style={{
                    listStyleType: "none",
                    margin: 0,
                    padding: 0
                }}
            >
                {key}
            </ul>
        </div>
    );
};

const mapStateToProps = (state: IState) => {
    const { selectedSchool } = state;
    selectedSchool.data = School.fromJson(selectedSchool.data);
    return { selectedSchool };
};

export default connect(mapStateToProps)(Admin);
