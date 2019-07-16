import ClassPeriod from "../@types/classperiod";
import Time from "../@types/time";
import School from "../@types/school";
import { TimeComparisons, TimeStates } from "./enums";

/**
 * @returns a flag that represents the current chunk of time categorically
 */
export function getTimeStateForDate(date: Date) {
    const currentSchool = getSelectedSchool();
    const currentBellSchedule = currentSchool.getScheduleForDate(date);

    //there is no schedule that applies today
    if (currentBellSchedule === undefined) {
        return TimeStates.DAY_OFF;
    }

    const currentClassPeriod = currentBellSchedule.getClassPeriodForTime(date);

    //it is a school day but it is not school hours
    if (!currentSchool.isInSession(date)) {
        return TimeStates.OUTSIDE_SCHOOL_HOURS;
    }

    //the current time lies between the start of the first schedules class and the end of the last
    else if (currentSchool.isInSession(date) && currentClassPeriod === undefined) {
        return TimeStates.SCHOOL_IN_CLASS_OUT;
    }

    //the current time lies within a scheduled class period
    else if (currentClassPeriod !== undefined) {
        return TimeStates.CLASS_IN_SESSION;
    }
}

export function getSelectedSchool(): School {}

export function getCurrentTimeObject() {
    return Time.fromDate(new Date());
}

/**
 * @returns the current time as a formatted string
 */
// export function getCurrentTimeString() {
//     return this.currentDate.toLocaleString("en-US", {
//         hour: "numeric",
//         minute: "numeric",
//         second: "numeric",
//         hour12: !this.use24HourTime
//     });
// }

// /**
//  * @returns the current date as a formatted string
//  */
// export function getCurrentDateString() {
//     return (
//         "on <strong>" +
//         this.currentDate.toLocaleString("en-US", {
//             weekday: "short",
//             month: "short",
//             day: "numeric",
//             year: "numeric"
//         }) +
//         "</strong>"
//     );
// }

/**
 * @returns the index of the class that started most recently
 */
export function getMostRecentlyStartedClass(date: Date) {
    const time = Time.fromDate(date);

    const bellchedule = getSelectedSchool().getScheduleForDate(date);

    if (bellchedule === undefined) {
        return undefined;
    }

    const classes = bellchedule.getAllClasses();

    const currentClass = bellchedule.getClassPeriodForTime(time);

    switch (getTimeStateForDate(date)) {
        case TimeStates.CLASS_IN_SESSION:
            return currentClass;
        case TimeStates.SCHOOL_IN_CLASS_OUT:
            for (const classPeriod of classes) {
                if (classPeriod.stateForTime(time) === TimeComparisons.IS_BEFORE) {
                    return classes[classes.indexOf(classPeriod) - 1];
                }
            }
            break;
        default:
            return undefined;
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

    if (startCheck > 0) {
        return TimeComparisons.IS_BEFORE;
    } else if (endCheck < 0) {
        return TimeComparisons.IS_AFTER;
    } else {
        return TimeComparisons.IS_DURING_OR_EXACTLY;
    }
}
