import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import School from "../@types/school";
import { pages } from "../utils/constants";
import BellSchedule from "../@types/bellschedule";
import { ISchoolsState } from "../store/schools/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "@auth0/auth0-react";
import Calendar from "../components/Calendar/Calendar";
import { startOfDay } from "date-fns";
import SelectHeader from "../components/SelectHeader";
import ClassClockService from "../services/classclock";
import SelectionList from "../components/SelectionList/SelectionList";
import Link from "../components/Link";
import EditableField from "../components/EditableField";
import cloneDeep from 'lodash.clonedeep'
import { selectSchool } from "../store/schools/actions";

export interface IAdminProps {
    selectedSchool: {
        isFetching: boolean;
        didInvalidate: false;
        data: School;
    };
    dispatch: any;
}

const Admin = (props: IAdminProps) => {
    const { user, getAccessTokenSilently } = useAuth0();

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
    
    const generateColors = (bellschedules?: BellSchedule[]) => {

        if (bellschedules) {
            const colors = generateHslaColors(80, 50, 1, bellschedules.length)
            bellschedules.forEach((schedule, index) => {
                schedule.setColor(colors[index]);
            });
        }
    }
    
    const getKey = (bellschedules?: BellSchedule[]) => {
        generateColors(bellschedules);
        const keyItems: JSX.Element[] = [];

        if (bellschedules) {

            bellschedules.forEach((schedule, index) => {
                keyItems.push(
                    <li
                        key={schedule.getIdentifier()}
                        style={{ backgroundColor: schedule.getColor() }}>
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
            const token: string = await getAccessTokenSilently() || '';

            if (schedules !== undefined) {
                for (const schedule of schedules) {

                    delete schedule['color'];

                    if (token != '') {
                        //send cloned schedule to API
                        ClassClockService.validateResponse(
                            ClassClockService.updateBellSchedule(schedule, token)
                        );
                        //refresh schedules so future going into the admin panel shows new data
                        props.dispatch(selectSchool(props.selectedSchool.data.getIdentifier()))
                    } else {
                        //this should never happen
                    }

                }
            } else {
                //major problem
            }
        }
    }

    const getNewScheduleWarning = (inline:boolean = true) => {
        let style:React.CSSProperties = { maxWidth: "600px" }
        if (inline) {
            style = {...style, display: "inline"}
        }

        return <p style={style}>To add a new schedule, contact me at <span className="e-mail" title="To prevent automated spam, this email address cannot be copied"></span></p>
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
        generateColors(schoolClone.getSchedules());
        return (
            <>
            <p>
                You are editing the{" "}
                <Link
                    // tslint:disable-next-line: jsx-no-lambda
                    destination={() => selectSchedule("")}
                    title="Change Schedule"
                >
                    {/* This shoud be fine because its behind the selection screen */}
                        {selectedSchedule? selectedSchedule.getName():""}
                </Link>{" "}
                Schedule
            </p>
            <div className="horizontalFlex">
                    {getKey(schoolClone.getSchedules())}
                    <Calendar schedules={schoolClone.getSchedules()} selectedScheduleId={selectedScheduleID} />
            </div>
            <button onClick={confirmUpdate}>Update Schedules</button>
            <button onClick={confirmClear}>Clear Changes</button>
            {getNewScheduleWarning(false)}
            </>
        )
    }

    return (
        <>
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
                <>
                <SelectionList title="Select a Schedule to Edit" loading={false} className="centeredWidth" >

                        {getBellScheduleSelectionList(schedules)}


                </SelectionList>
                {getNewScheduleWarning()}
                </>

            )}
            
        </>
    );
};


export default connect()(Admin);
