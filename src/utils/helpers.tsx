import { IPeriod } from "../@types/interfaces";
import Time from "../@types/time";
import School from "../@types/school";
import { TimeComparisons, TimeStates } from "./enums";

/**
 * @returns a flag that represents the current chunk of time categorically
 */
export function getCurrentTimeState() {
    //there is no schedule that applies today
    if (isNoSchoolDay()) {
        return TimeStates.DAY_OFF;
    }

    //it is a school day but it is not school hours
    else if (!this.schoolIsInSession()) {
        return TimeStates.OUTSIDE_SCHOOL_HOURS;
    }

    //the current time lies between the start of the first schedules class and the end of the last
    else if (this.schoolIsInSession() && !classIsInSession()) {
        return TimeStates.SCHOOL_IN_CLASS_OUT;
    }

    //the current time lies within a scheduled class period
    else if (classIsInSession()) {
        return TimeStates.CLASS_IN_SESSION;
    }
}

/**
 * @returns the current schedule name or "No School" if there is no school scheduled today
 */
export function getCurrentScheduleName() {
    if (!isNoSchoolDay()) {
        return this.schools[this.selectedSchoolIndex].schedules[getCurrentScheduleIndex()]
            .name;
    } else {
        return "No School";
    }
}

/**
 * this export function checks to see if the currentClassPeriodIndex is valid (greater than -1), indicating that there is currently a scheduled class period happening
 *
 * @returns a boolean representing if class is in session
 */
export function classIsInSession() {
    return getCurrentClassPeriodIndex() >= 0 && !isNoSchoolDay();
    //might later want to add a check to make sure that currentClassPeriodIndex is not greater than the number of classes in the schedule for today
}

/**
 * this export function checks to see if the current time is between the start of the first scheduled class and the end of the last scheduled class. This indicates that school is currently in session
 *
 * @returns a boolean representing if school is in session
 */
export function schoolIsInSession() {
    return (
        this.checkTimeRange(
            this.getCurrentTimeObject(),
            this.schools[this.selectedSchoolIndex].schedules[getCurrentScheduleIndex()]
                .classes[0].startTime,
            this.schools[this.selectedSchoolIndex].schedules[getCurrentScheduleIndex()]
                .classes[
                this.schools[this.selectedSchoolIndex].schedules[
                    getCurrentScheduleIndex()
                ].classes.length - 1
            ].endTime
        ) === 0
    );
}

/**
 *  this export function checks to see if the currentScheduleIndex is valid (greater than -1), indicating that there is a schedule for the day
 *
 * @returns true if there is no schedule that applies to today, false if there is
 */
export function isNoSchoolDay() {
    return getCurrentScheduleIndex() <= -1;
    //might later want to add a check to make sure that currentScheduleIndex is not greater than the number of schedules
}

export function getCurrentTimeObject() {
    return {
        hours: this.currentDate.getHours(),
        minutes: this.currentDate.getMinutes(),
        seconds: this.currentDate.getSeconds()
    };
}

/**
 * @returns the current time as a formatted string
 */
export function getCurrentTimeString() {
    return this.currentDate.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: !this.use24HourTime
    });
}

/**
 * @returns the current date as a formatted string
 */
export function getCurrentDateString() {
    return (
        "on <strong>" +
        this.currentDate.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        }) +
        "</strong>"
    );
}

/**
 * this export function determines the index of the class period that is currently going on (if any)
 *
 * @returns an index for looking up the current class period, or -1 if there is no class happening right now
 */
export function getCurrentClassPeriodIndex() {
    if (isNoSchoolDay()) {
        //return immediately if there is no school today
        return -1;
    }

    const schedule = this.schools[this.selectedSchoolIndex].schedules[
        getCurrentScheduleIndex()
    ];
    //using for over forEach() because we are breaking out of the loop early
    for (let i = 0; i < schedule.classes.length; i++) {
        if (
            this.checkClassTime(schedule.classes[i]) ===
            TimeComparisons.IS_DURING_OR_EXACTLY
        ) {
            return i;
        }
    }
    return -1; //no match found, there is no class currently in session
}

/**
 * @returns the index of the class that started most recently
 */
export function getMostRecentlyStartedClassIndex() {
    if (isNoSchoolDay()) {
        //return immediately if there is no school today
        return -1;
    }

    //using for over forEach() because we are breaking out of the loop early
    for (
        let i = 0;
        i <
        this.schools[this.selectedSchoolIndex].schedules[getCurrentScheduleIndex()]
            .classes.length;
        i++
    ) {
        const classPeriodStatus = this.checkClassTime(
            this.schools[this.selectedSchoolIndex].schedules[getCurrentScheduleIndex()]
                .classes[i]
        );
        let nextClassPeriodStatus;
        if (
            i + 1 <
            this.schools[this.selectedSchoolIndex].schedules[getCurrentScheduleIndex()]
                .classes.length
        ) {
            nextClassPeriodStatus = this.checkClassTime(
                this.schools[this.selectedSchoolIndex].schedules[
                    getCurrentScheduleIndex()
                ].classes[i + 1]
            );
        }

        if (classPeriodStatus === -1) {
            //class hasnt started, do nothing
        } else if (classPeriodStatus === 0) {
            //class is currently in session, return index
            return i;
        } else if (
            classPeriodStatus === 1 &&
            (typeof nextClassPeriodStatus !== "undefined" && nextClassPeriodStatus === -1)
        ) {
            //class has passed and next class hasnt started (indicating a passing period)
            //return the class index
            return i;
        }
    }
}

/**
 * this export function determines the index of the schedule that applies to today (if any)
 *
 * @returns an index for looking up the current schedule, or -1 if there is no school today
 */
export function getCurrentScheduleIndex() {
    //using for over forEach() because we are breaking out of the loop early
    for (let i = 0; i < this.schools[this.selectedSchoolIndex].schedules.length; i++) {
        if (
            this.schools[this.selectedSchoolIndex].schedules[i].days.includes(
                this.currentDate.getDay()
            )
        ) {
            return i;
        }
    }
    //if execution reaches here, no schedules were found for today, so it must be a no school day
    return -1;
}

/**
 * Compares the hours and minutes of two times, aassuming all times occoured on the same day
 *
 * @param {*} time1
 * @param {*} time2
 * @returns -1 if time1 is before time2, 0 if they are the same, 1 if time1 is after time2
 */
export function compareTimes(timeObject1: Time, timeObject2: Time) {
    const time1 = timeObject1.get_valid_time();
    const time2 = timeObject2.get_valid_time();

    const hoursDiff = time1.hours - time2.hours;
    const minutesDiff = time1.minutes - time2.minutes;
    const secondsDiff =
        typeof time1.seconds !== "undefined" && typeof time2.seconds !== "undefined"
            ? time1.seconds - time2.seconds
            : null;

    if (hoursDiff < 0) {
        return -1;
    } else if (hoursDiff > 0) {
        return 1;
    }

    //hours are the same if execution reaches here

    if (minutesDiff < 0) {
        return -1;
    } else if (minutesDiff > 0) {
        return 1;
    }

    //hours and minutes are the same if execution reaches here

    if (secondsDiff !== null) {
        if (secondsDiff < 0) {
            return -1;
        } else if (secondsDiff > 0) {
            return 1;
        }
    }

    //hours, minutes, and seconds are the same if execution reaches here
    return 0;
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

export function checkClassTime(classPeriod: IPeriod) {
    return this.checkTimeRange(
        this.getCurrentTimeObject(),
        classPeriod.startTime,
        classPeriod.endTime
    );
}

/**
 * This fucntion is used for calculating how long until school starts
 * @returns the time to the start of school as a string
 */
export function getTimeToStartOfSchoolString() {
    const startOfSchool = this.schools[this.selectedSchoolIndex].schedules[
        getCurrentScheduleIndex()
    ].classes[0].startTime;
    if (
        !classIsInSession() &&
        !isNoSchoolDay() &&
        this.getCurrentTimeObject().getMillisecondsTo(startOfSchool) < 0
    ) {
        return this.getCurrentTimeObject()
            .getTimeDeltaTo(startOfSchool)
            .toString();
    } else {
        return "No Class";
    }
}

/**
 *
 * @param {*} index the index of the class to return the name for
 * @returns returns the class name for the given index or "No Class" if there is no class in session
 */
export function getClassName(index: number) {
    const classes = this.schools[this.selectedSchoolIndex].schedules[
        getCurrentScheduleIndex()
    ].classes;

    if (index >= 0 && index < classes.length) {
        return classes[index].name.toString();
    } else {
        return "No Class";
    }
}

/**
 *  converts a time object into a formatted time string based on the user's time format (12/24 hour) preferences
 *
 * @param {*} timeObject the time object to convert to a string
 * @returns the string in either 12 or 24 hour format
 */
export function getFormattedTimeStringFromObject(timeObject: Time) {
    let pmString = "";

    //convert to 12 hour if necessary
    if (!this.use24HourTime && timeObject.hours >= 12) {
        if (timeObject.hours > 12) {
            timeObject.hours -= 12;
        }
        pmString = " PM";
    } else if (!this.use24HourTime) {
        pmString = " AM";
    }

    return timeObject.toString() + pmString;
}
