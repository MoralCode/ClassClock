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
import Calendar from "../components/Calendar/Calendar";
import { startOfDay } from "date-fns";
import SelectHeader from "../components/SelectHeader";
import ClassClockService from "../services/classclock";
import SelectionList from "../components/SelectionList/SelectionList";
import Link from "../components/Link";
import EditableField from "../components/EditableField";
import cloneDeep from 'lodash.clonedeep'

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

    const [selectedScheduleID, selectSchedule] = useState("");
    
    const getCopyOfCurrentSchool = () => {
        //might want to use deltas later rather than storing a full copy
        return cloneDeep(props.selectedSchool.data)
    }

    const [schoolClone, setSchoolClone] = useState(getCopyOfCurrentSchool);    
    const schedules = schoolClone.getSchedules()
    const selectedSchedule = schoolClone.getSchedule(selectedScheduleID)


    // if (
    //     user === undefined ||
    //     props.selectedSchool.data.getOwnerIdentifier() !== user.sub
    // ) {
    //     //user does not own school
    //     navigate(pages.main);
    // }


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
    
    
    const getKey = (bellschedules?: BellSchedule[]) => {
        const keyItems: JSX.Element[] = [];

        if (bellschedules) {
            const colors = generateHslaColors(80, 50, 1, bellschedules.length)

            bellschedules.forEach((schedule, index) => {
                schedule.setColor(colors[index]);
                keyItems.push(
                    <li
                        key={schedule.getIdentifier()}
                        style={{ backgroundColor: schedule.getColor(), cursor: "pointer" }}
                        className={schedule.getIdentifier() === selectedScheduleID ? "selected" : undefined}
                        onClick={() => { selectSchedule(schedule.getIdentifier()) }}>
                        {schedule.getName()}
                    </li>
                );
                
            });
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
            {keyItems}
        </ul>)
    }

    const confirmClear = () => {
        if (window.confirm("Are you sure you want to reset all of your changes?")) {
            setSchoolClone(getCopyOfCurrentSchool())
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
    const getBellScheduleSelectionList = (scheduleList?: BellSchedule[]) => {
        const selectionList: JSX.Element[] = [];

        if (scheduleList) {
            scheduleList.forEach((schedule) => {
                selectionList.push(
                    <li
                        key={schedule.getIdentifier()}
                        style={{ cursor: "pointer" }}
                        onClick={() => { selectSchedule(schedule.getIdentifier()) }}>
                        {schedule.getName()}
                    </li>
                );
            });
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
                    {/* This shoud be fine because its behind the selection screen */}
                        {selectedSchedule? selectedSchedule.getName():""}
                </Link>
            </p>
            <div className="horizontalFlex">
                {getKey(schedules)}
                <Calendar options={selectedDates} onDateChange={(schedule: BellSchedule) => setSelectedDates(schedule.getIdentifier())} selectedSchedule={selectedScheduleID} />
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
                <EditableField label="School name:"
                    value={props.selectedSchool.data.getName()}
                    onChange={() => {}}
                    readOnly={true} />
                <br />
                <EditableField label="School acronym:"
                    value={props.selectedSchool.data.getAcronym()}
                    onChange={() => { }}
                    readOnly={true} />
            </div>
            <br />
            {(selectedScheduleID !== "")? (
                <ScheduleAdmin />
            ):(
                <SelectionList title="Select a Schedule to Edit" loading={false} >

                        {getBellScheduleSelectionList(schedules)}


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
