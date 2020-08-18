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
import ClassClockService from "../services/classclock";
import SelectionList from "../components/SelectionList/SelectionList";
import Link from "../components/Link";

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

    const [selectedSchedule, selectSchedule] = useState("");
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

    //https://mika-s.github.io/javascript/colors/hsl/2017/12/05/generating-random-colors-in-javascript.html
    const generateHslaColors = (saturation: number, lightness: number, alpha: number, amount: number) => {
        const colors = []
        const huedelta = Math.trunc(360 / amount)

        for (let i = 0; i < amount; i++) {
            const hue = i * huedelta
            colors.push(`hsla(${hue},${saturation}%,${lightness}%,${alpha})`)
        }

        return colors
    }



    const getScheduleOptions = () => {
        const optionProps: IScheduleDates = {};
        let colorIndex = 0;
        if (schedules !== undefined) {
            const colors = generateHslaColors(80, 50, 1, schedules.length)

            for (const schedule of schedules) {
                optionProps[schedule.getIdentifier()] = {
                    color: colors[colorIndex],
                    name: schedule.getName(),
                    dates: schedule
                        .getDates()
                        .map((value: Date) => startOfDay(value).getTime())
                };
                colorIndex++;
            }
        }
        return optionProps;
    };

    const scheduleOptions = getScheduleOptions();
    //the selected calendar dates
    const [selectedDates, setSelectedDates] = useState(scheduleOptions);


    const getKey = () => {
        const key = [];
        for (const option in scheduleOptions) {
            if (scheduleOptions.hasOwnProperty(option)) {
                key.push(
                    <li
                        key={option}
                        style={{ backgroundColor: scheduleOptions[option].color, cursor: "pointer" }}
                        className={option === selectedSchedule ? "selected" : undefined}
                        onClick={() => { selectSchedule(option) }}>
                        {scheduleOptions[option].name}
                    </li>
                );
            }
        }
        return (<ul
            style={{
                listStyleType: "none",
                margin: 0,
                padding: 0,
                display: "inline-block"
            }}
            id="key"
        >
            {key}
        </ul>)
    }

    const confirmClear = () => {
        if (window.confirm("Are you sure you want to reset all of your changes?")) {
            setSelectedDates(getScheduleOptions())
        }
    }

    const confirmUpdate = async () => {
        if (window.confirm("Are you sure you want to publish these schedule changes?")) {
            const token: string = await getTokenSilently() || '';

            if (schedules !== undefined) {
                for (const schedule of schedules) {

                    // props.selectedSchool.data

                    let updatedUnixDates = selectedDates[schedule.getIdentifier()].dates;
                    let updatedDates: Date[];

                    if (updatedUnixDates) {
                        updatedDates = updatedUnixDates.map((value: number) => new Date(value))
                    } else {
                        updatedDates = []
                    }

                    //set dates
                    schedule.setDates(updatedDates)

                    if (token != '') {
                        //send to API
                        ClassClockService.validateResponse(
                            ClassClockService.updateBellSchedule(schedule, token)
                        );
                    } else {
                        //this should never happen
                    }

                }
            } else {
                //major problem
            }
        }
    }

    const getBellScheduleSelectionList = (scheduleOptions:IScheduleDates) => {
        const selectionList = [];
        for (const option in scheduleOptions) {
            if (scheduleOptions.hasOwnProperty(option)) {
                selectionList.push(
                    <li
                        key={option}
                        style={{ cursor: "pointer" }}
                        onClick={() => { selectSchedule(option) }}>
                        {scheduleOptions[option].name}
                    </li>
                );
            }
        }
        return selectionList;
    }


    const ScheduleAdmin = () => {
        return (
            <>
            <p>
                You are editing the{" "}
                <Link
                    // tslint:disable-next-line: jsx-no-lambda
                    destination={() => selectSchedule("")}
                >
                    {scheduleOptions[selectedSchedule].name}
                </Link>
            </p>
            <div className="horizontalFlex">
                {getKey()}
                <Calendar options={selectedDates} onDateChange={(options: IScheduleDates) => setSelectedDates(options)} selectedSchedule={selectedSchedule} />
            </div>
            <button onClick={confirmUpdate}>Update Schedules</button>
            <button onClick={confirmClear}>Clear Changes</button>
            </>
        )
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
            {(selectedSchedule !== "")? (
                <ScheduleAdmin />
            ):(
                <SelectionList title="Select a Schedule to Edit" loading={false} >

                        {getBellScheduleSelectionList(scheduleOptions)}


                </SelectionList>
            )}
            
        </div>
    );
};

const mapStateToProps = (state: IState) => {
    const { selectedSchool } = state;
    selectedSchool.data = School.fromJson(selectedSchool.data);
    return { selectedSchool };
};

export default connect(mapStateToProps)(Admin);
