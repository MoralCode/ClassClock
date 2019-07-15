import { Time, Period } from "../@types/classclockTypes";

 
 /**
     * @returns a flag that represents the current chunk of time categorically
     */
    public getCurrentTimeState() {
    //there is no schedule that applies today
    if (this.getCurrentScheduleIndex() <= -1) {
        return App.DAY_OFF_FLAG;
    }

    //it is a school day but it is not school hours
    else if (!this.schoolIsInSession()) {
        return App.OUTSIDE_SCHOOL_HOURS_FLAG;
    }

    //the current time lies between the start of the first schedules class and the end of the last
    else if (this.schoolIsInSession() && !this.classIsInSession()) {
        return App.SCHOOL_IN_CLASS_OUT_FLAG;
    }

    //the current time lies within a scheduled class period
    else if (this.classIsInSession()) {
        return App.CLASS_IN_SESSION_FLAG;
    }
}

    /**
     * @returns the current schedule name or "No School" if there is no school scheduled today
     */
    public getCurrentScheduleName() {
    if (!this.isNoSchoolDay()) {
        return this.schools[this.selectedSchoolIndex].schedules[
            this.currentScheduleIndex
        ].name;
    } else {
        return "No School";
    }
}

    /**
     * this public checks to see if the currentClassPeriodIndex is valid (greater than -1), indicating that there is currently a scheduled class period happening
     *
     * @returns a boolean representing if class is in session
     */
    public classIsInSession() {
    return this.currentClassPeriodIndex >= 0 && !this.isNoSchoolDay();
    //might later want to add a check to make sure that currentClassPeriodIndex is not greater than the number of classes in the schedule for today
}

    /**
     * this public checks to see if the current time is between the start of the first scheduled class and the end of the last scheduled class. This indicates that school is currently in session
     *
     * @returns a boolean representing if school is in session
     */
    public schoolIsInSession() {
    return (
        this.checkTimeRange(
            this.getCurrentTimeObject(),
            this.schools[this.selectedSchoolIndex].schedules[
                this.currentScheduleIndex
            ].classes[0].startTime,
            this.schools[this.selectedSchoolIndex].schedules[
                this.currentScheduleIndex
            ].classes[
                this.schools[this.selectedSchoolIndex].schedules[
                    this.currentScheduleIndex
                ].classes.length - 1
            ].endTime
        ) === 0
    );
}

    /**
     *  this public checks to see if the currentScheduleIndex is valid (greater than -1), indicating that there is a schedule for the day
     *
     * @returns true if there is no schedule that applies to today, false if there is
     */
    public isNoSchoolDay() {
    return this.currentScheduleIndex <= -1;
    //might later want to add a check to make sure that currentScheduleIndex is not greater than the number of schedules
}


  public getCurrentTimeObject() {
    return {
        hours: this.currentDate.getHours(),
        minutes: this.currentDate.getMinutes(),
        seconds: this.currentDate.getSeconds()
    };
}

    /**
     * @returns the current time as a formatted string
     */
    public getCurrentTimeString() {
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
    public getCurrentDateString() {
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
     * this public determines the index of the class period that is currently going on (if any)
     *
     * @returns an index for looking up the current class period, or -1 if there is no class happening right now
     */
    public getCurrentClassPeriodIndex() {
    if (this.isNoSchoolDay()) {
        //return immediately if there is no school today
        return -1;
    }

    //using for over forEach() because we are breaking out of the loop early
    for (
        let i = 0;
        i <
        this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex]
            .classes.length;
        i++
    ) {
        if (
            this.checkClassTime(
                this.schools[this.selectedSchoolIndex].schedules[
                    this.currentScheduleIndex
                ].classes[i]
            ) === 0
        ) {
            return i;
            break; //not sure if this is necessary so I included it anyway
        }
    }
    return -1; //no match found, there is no class currently in session
}

    /**
     * @returns the index of the class that started most recently
     */
    public getMostRecentlyStartedClassIndex() {
    if (this.isNoSchoolDay()) {
        //return immediately if there is no school today
        return -1;
    }

    //using for over forEach() because we are breaking out of the loop early
    for (
        let i = 0;
        i <
        this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex]
            .classes.length;
        i++
    ) {
        let classPeriodStatus = this.checkClassTime(
            this.schools[this.selectedSchoolIndex].schedules[
                this.currentScheduleIndex
            ].classes[i]
        );
        let nextClassPeriodStatus;
        if (
            i + 1 <
            this.schools[this.selectedSchoolIndex].schedules[
                this.currentScheduleIndex
            ].classes.length
        ) {
            nextClassPeriodStatus = this.checkClassTime(
                this.schools[this.selectedSchoolIndex].schedules[
                    this.currentScheduleIndex
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
            (typeof nextClassPeriodStatus !== "undefined" &&
                nextClassPeriodStatus === -1)
        ) {
            //class has passed and next class hasnt started (indicating a passing period)
            //return the class index
            return i;
        }
    }
}

    /**
     * this public determines the index of the schedule that applies to today (if any)
     *
     * @returns an index for looking up the current schedule, or -1 if there is no school today
     */
    public getCurrentScheduleIndex() {
    //using for over forEach() because we are breaking out of the loop early
    for (
        let i = 0;
        i < this.schools[this.selectedSchoolIndex].schedules.length;
        i++
    ) {
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
    public compareTimes(timeObject1: Time, timeObject2: Time) {
    let time1 = this.sanitizeTimeObject(timeObject1);
    let time2 = this.sanitizeTimeObject(timeObject2);

    let hoursDiff = time1.hours - time2.hours;
    let minutesDiff = time1.minutes - time2.minutes;
    let secondsDiff =
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
     * This public checks if the current time is between the two given times
     * This is useful for checking which class period you are currently in or for checking if school is in session.
     *
     * @param {*} checkTime the time that the check results are returned for
     * @param {*} startTime the start time of the range to check
     * @param {*} endTimethe the end time of the range to check
     *
     * @returns -1 if checkTime is before range, 0 if checkTime is within range, 1 if checkTime is after range
     */
    public checkTimeRange(checkTime: Time, startTime: Time, endTime: Time) {
    let startCheck = this.compareTimes(checkTime, startTime);
    let endCheck = this.compareTimes(checkTime, endTime);

    if (startCheck === -1) {
        return -1;
    } else if (startCheck >= 0 && endCheck <= 0) {
        return 0;
    } else {
        return 1;
    }
}

    public checkClassTime(classPeriod: Period) {
    return this.checkTimeRange(
        this.getCurrentTimeObject(),
        classPeriod.startTime,
        classPeriod.endTime
    );
}

    /**
     * this public gets the absolute value of the difference between the given time and the current time
     *
     * @param {*} time the time that you want to calculate the delta to from the current time
     * @returns the absolute value of the difference between the given time and the current time as an object
     */
    public getTimeDelta(timeObject1: Time, timeObject2: Time) {
    var time1ms = new Date(
        2000,
        0,
        1,
        timeObject1.hours,
        timeObject1.minutes,
        timeObject1.seconds
    ).getTime();
    var time2ms = new Date(
        2000,
        0,
        1,
        timeObject2.hours,
        timeObject2.minutes,
        timeObject2.seconds
    ).getTime();

    return this.convertMillisecondsToTime(Math.abs(time1ms - time2ms));
}

    /**
     * this public returns a new time object that has been checked for inconsistencies
     * such as omitted or invalid values and corrected
     *
     * @param {*} timeObject the timeObject to validate
     * @returns a new, validated time object
     */
    public sanitizeTimeObject(timeObject: Time) {
    //this prevents the original object from being modified
    var newTimeObject = timeObject;

    if (newTimeObject.hours === undefined) {
        newTimeObject.hours = 0;
    }
    if (newTimeObject.minutes === undefined) {
        newTimeObject.minutes = 0;
    }
    if (newTimeObject.seconds === undefined) {
        newTimeObject.seconds = 0;
    }
    // if (timeObject.milliseconds=== undefined ) { timeObject.milliseconds = 0; }

    //timeObjects are always in 24-hour time
    newTimeObject.hours = newTimeObject.hours % 24;
    newTimeObject.minutes = newTimeObject.minutes % 60;
    newTimeObject.seconds = newTimeObject.seconds % 60;
    // timeObject.milliseconds = timeObject.milliseconds % 1000;

    return newTimeObject;
}

    /**
     * converts a given number of milliseconds into a time object. Used for calculating the time between now and the end of the current class
     *
     * @param {*} milliseconds the number of milliseconds to convert
     * @returns a time object
     */
    public convertMillisecondsToTime(milliseconds: number): Time {
    //theres probably a better way to do this using Date()
    let time = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    //convert from milliseconds to H:M:S
    time.hours = Math.floor(milliseconds / 1000 / 60 / 60);
    milliseconds -= time.hours * 1000 * 60 * 60;
    time.minutes = Math.floor(milliseconds / 1000 / 60);
    milliseconds -= time.minutes * 1000 * 60;
    time.seconds = Math.floor(milliseconds / 1000);
    milliseconds -= time.seconds * 1000;
    //we dont need milliseconds so ignore this
    //time.milliseconds = milliseconds
    return time;
}

    /**
     * This fucntion is used for calculating how long until school starts
     * @returns the time to the start of school as a string
     */
    public getTimeToStartOfSchoolString() {
    if (
        !this.classIsInSession() &&
        !this.isNoSchoolDay() &&
        this.compareTimes(
            this.getCurrentTimeObject(),
            this.schools[this.selectedSchoolIndex].schedules[
                this.currentScheduleIndex
            ].classes[0].startTime
        ) === -1
    ) {
        return this.getTimeStringFromObject(
            this.getTimeTo(
                this.schools[this.selectedSchoolIndex].schedules[
                    this.currentScheduleIndex
                ].classes[0].startTime
            )
        );
    } else {
        return "No Class";
    }
}

    /**
     * A shortcut public that inserts the current time into getTimeDelta() for convenience
     *
     * @param {*} timeObject
     * @returns
     */
    public getTimeTo(timeObject: Time) {
    return this.getTimeDelta(this.getCurrentTimeObject(), timeObject);
}

    /**
     *  converts a time object into a string
     *
     * @param {*} timeObject the time object to convert
     * @param {boolean} [includeSeconds=true] a boolean representing whether seconds should be included in this string (i.e. for a countdown) or not (i.e. for displaying a fixed time)
     * @returns a String in either HH:MM format or HH:MM:SS format
     */
    public getTimeStringFromObject(timeObject: Time, includeSeconds = true): string {
    if (typeof timeObject.seconds !== "undefined" && includeSeconds) {
        //you can really tell how much i dont like to duplicate code here haha
        return (
            this.getTimeStringFromObject(timeObject, false) +
            ":" +
            timeObject.seconds.toString().padStart(2, "0")
        );
    } else {
        return (
            timeObject.hours.toString().padStart(2, "0") +
            ":" +
            timeObject.minutes.toString().padStart(2, "0")
        );
    }
}

    /**
     *
     * @param {*} index the index of the class to return the name for
     * @returns returns the class name for the given index or "No Class" if there is no class in session
     */
    public getClassName(index: number) {
    var classes = this.schools[this.selectedSchoolIndex].schedules[
        this.currentScheduleIndex
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
    public getFormattedTimeStringFromObject(timeObject: Time) {
    var pmString = "";

    //convert to 12 hour if necessary
    if (!this.use24HourTime && timeObject.hours >= 12) {
        if (timeObject.hours > 12) {
            timeObject.hours -= 12;
        }
        pmString = " PM";
    } else if (!this.use24HourTime) {
        pmString = " AM";
    }

    return this.getTimeStringFromObject(timeObject, false) + pmString;
}