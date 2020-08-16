import Time from "../@types/time";
import School from "../@types/school";
import { TimeComparisons, TimeStates } from "./enums";
import ClassPeriod from "../@types/classperiod";
import BellSchedule from "../@types/bellschedule";
import { useState } from "react";

//https://stackoverflow.com/a/55862077
export const useForceUpdate = () => {
    const [, setTick] = useState(0);
    const update = () => {
        setTick((tick: number) => tick + 1);
    };
    return update;
};

export function getValueIfKeyInList(list: string[], object: any) {
    for (const key of list) {
        if (object.hasOwnProperty(key)) {
            return object[key];
        }
    }
}


export function objectKeysToSnakeCase(object: object) {
    let copyObject: any = Object.assign({}, object);

    //iterate over object
    for (const [objKey, objValue] of Object.entries(copyObject)) {
        // if (value.hasOwnProperty(objKey))
        const snake = toSnakeCase(objKey);
        if (objKey !== snake) {
            copyObject[snake] = objValue;
            delete copyObject[objKey];
        }
    }
    return copyObject;
}

// https://stackoverflow.com/a/54246525/
export function toSnakeCase(input: string) {
    // https://stackoverflow.com/a/55521416/
    const ALPHA = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

    function isAlpha(char: string) {
        return ALPHA.has(char);
    }
    
    return input.split('').map((character, index) => {
        if (character == character.toUpperCase() && isAlpha(character)) {
            return (index != 0 ? '_': '') + character.toLowerCase();
        } else {
            return character;
        }
    }).join('');
}


export function getCurrentDate() {
    return new Date();
}

export function sortClassesByStartTime(classes: ClassPeriod[]) {
    return classes.sort((a, b) => -a.getStartTime().getMillisecondsTo(b.getStartTime()));
}

/**
 * @returns a flag that represents the current chunk of time categorically
 */
export function getTimeStateForDateAtSchool(date: Date, school: School) {
    const currentBellSchedule = school.getScheduleForDate(date);

    //there is no schedule that applies today
    if (!currentBellSchedule) {
        return TimeStates.DAY_OFF;
    }

    const currentClassPeriod = currentBellSchedule.getClassPeriodForTime(
        Time.fromDate(date)
    );

    //it is a school day but it is not school hours
    if (!school.isInSession(date)) {
        return TimeStates.OUTSIDE_SCHOOL_HOURS;
    }

    //the current time lies between the start of the first schedules class and the end of the last
    else if (school.isInSession(date) && !currentClassPeriod) {
        return TimeStates.SCHOOL_IN_CLASS_OUT;
    }

    //the current time lies within a scheduled class period
    else if (currentClassPeriod !== undefined) {
        return TimeStates.CLASS_IN_SESSION;
    }
}

/**
 * @returns the next relevent time to count down to
 */
export function getNextImportantInfo(
    date: Date,
    school: School
): [ClassPeriod, Time] | undefined {
    const currentBellSchedule = school.getScheduleForDate(date);

    //there is no schedule that applies today
    if (!currentBellSchedule) {
        return;
    }

    const classes = sortClassesByStartTime(currentBellSchedule.getAllClasses());
    //loop through all classes in order until you get to the first time that has not passed
    for (let i = 0; i < classes.length; i++) {
        for (const time of [classes[i].getStartTime(), classes[i].getEndTime()]) {
            if (Time.fromDate(date).getMillisecondsTo(time) >= 0) {
                const nextClass =
                    classes[i].stateForTime(Time.fromDate(date)) ===
                    TimeComparisons.IS_DURING_OR_EXACTLY
                        ? classes[i + 1]
                        : classes[i];
                return [nextClass, time];
            }
        }
    }
}

/**
 * This export function checks if the current time is between the two given times
 * This is useful for checking which class period you are currently in or for checking if school is in session.
 *
 * @param {*} checkTime the time that the check results are returned for
 * @param {*} startTime the start time of the range to check
 * @param {*} endTimethe the end time of the range to check
 *
 * @returns -1 if checkTime is before range, 0 if checkTime is within range, 1 if checkTime is after range
 */
export function checkTimeRange(checkTime: Time, startTime: Time, endTime: Time) {
    if (startTime.getMillisecondsTo(endTime) <= 0) {
        //theres a problem
    }
    const startCheck = checkTime.getMillisecondsTo(startTime);
    const endCheck = checkTime.getMillisecondsTo(endTime);

    if (startCheck > 0 && endCheck > 0) {
        return TimeComparisons.IS_BEFORE;
    } else if (endCheck < 0 && endCheck < 0) {
        return TimeComparisons.IS_AFTER;
    } else {
        return TimeComparisons.IS_DURING_OR_EXACTLY;
    }
}
