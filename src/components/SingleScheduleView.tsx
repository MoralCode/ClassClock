import React, { CSSProperties, ReactNode } from "react";
import Block from "./Block/Block";
import Link from "./Link";
import { pages } from "../utils/constants";
import BellSchedule from "../@types/bellschedule";
import ClassPeriod from "../@types/classperiod";
import School from "../@types/school";
import Time from "../@types/time";
import { DateTime } from "luxon";

export interface ISingleScheduleViewProps {
    currentSchool: School;
    currentSchedule: BellSchedule;
    currentClass?: ClassPeriod;
    nextImportantTime?: Time;
	nextClass?: ClassPeriod;
	currentDate: DateTime;
    navigate: Function; //this is probably a bit of a hack
}

const SingleScheduleView = (props: ISingleScheduleViewProps) => {
    return (
        <>
            <Block>
                <p>
                    Today is a{" "}
                    <Link
                        // tslint:disable-next-line: jsx-no-lambda
                        destination={() => props.navigate(pages.fullSchedule)}
                        id="viewScheduleLink"
                    >
                        {props.currentSchedule.getName()}
                    </Link>
                </p>
            </Block>
            <Block>
                <p>You are currently in: </p>
                <p className="timeFont" style={{ fontSize: "30px" }}>
                    <b>
                        {props.currentClass !== undefined
                            ? props.currentClass.getName()
                            : props.currentSchool.getPassingTimeName()}
                    </b>
                </p>
            </Block>
            <Block>
                <p>...which ends in:</p>
                {/* <h1 className="centered bottomSpace time bigger" id="timeToEndOfClass" /> */}
                <p className="timeFont" style={{ fontSize: "60px" }}>
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
                <p>Your next class period is: </p>
                <p className="timeFont" style={{ fontSize: "30px" }}>
                    <b>{props.nextClass ? props.nextClass.getName() : "No Class"}</b>
                </p>
            </Block>
        </>
    );
};

export default SingleScheduleView;
