import React, { CSSProperties, ReactNode } from "react";
import Block from "./Block/Block";
import Link from "./Link";
import { pages } from "../utils/constants";
import BellSchedule from "../@types/bellschedule";
import ClassPeriod from "../@types/classperiod";
import School from "../@types/school";
import Time from "../@types/time";
import { DateTime } from "luxon";

export interface IScheduleCardProps {
    currentSchool: School;
    currentSchedule: BellSchedule;
    currentClass?: ClassPeriod;
    nextImportantTime?: Time;
	nextClass?: ClassPeriod;
	currentDate: DateTime;
    key: string;
}

/// Schedule card is for displaying many schedules at once in an abbreveated form
const ScheduleCard = (props: IScheduleCardProps) => {
    //     <p>...which ends in:</p>
    //     {/* <h1 className="centered bottomSpace time bigger" id="timeToEndOfClass" /> */}
    //     <p className="timeFont" style={{ fontSize: "60px" }}>
    //         <b>
    //             {props.nextImportantTime
    //                 ? props.nextImportantTime
    //                       .getTimeDeltaTo(
    //                           Time.fromDateTime(
    //                               props.currentDate,
    //                               props.currentSchool.getTimezone()
    //                           )
    //                       )
    //                       .getFormattedString(false, true)
    //                 : "No Class"}
    //         </b>
    //     </p>
    //     <p>Your next class period is: </p>
    //     <p className="timeFont" style={{ fontSize: "30px" }}>
    //         <b>{props.nextClass ? props.nextClass.getName() : "No Class"}</b>
    //     </p>
    return (
        <Block>
            <p>
                {props.currentSchedule.getAudience()} is currently in{" "}
                <span className="timeFont" style={{ fontSize: "25px" }}>
                    <b>
                        {props.currentClass !== undefined
                            ? props.currentClass.getName()
                            : props.currentSchool.getPassingTimeName()}
                    </b>
                </span>
            </p>
            <p>
                which ends in...
            </p>
            <p className="timeFont" style={{ fontSize: "40px" }}>
                <b>
                    {props.nextImportantTime
                        ? props.nextImportantTime
                                .getTimeDeltaTo(
                                    Time.fromDateTime(
                                        props.currentDate,
                                        props.currentSchool.getTimezone()
                                    )
                                )
                                .getFormattedString(false, true)
                        : "No Class"}
                </b>
            </p>
        </Block>
    );
};

export default ScheduleCard;
