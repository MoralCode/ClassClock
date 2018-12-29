let DAY_OFF_FLAG = "day off"
let OUTSIDE_SCHOOL_HOURS_FLAG = "outside school hours"
let SCHOOL_IN_CLASS_OUT_FLAG = "school is in session, but class is not"
let CLASS_IN_SESSION_FLAG = "class is in session"






var currentDay = 0;
var currentHours = 0;
var currentMinutes = 0; 
var currentSeconds = 0;
var currentDate;

var currentClassPeriodIndex = -1;
//nextClassPeriodIndex

var currentScheduleIndex = -1;


var use24HourTime = getLocalStorageBoolean("use24HourTime", false);

var data = {
    fullName: "",
    shortName: "",
    //order is as is on the school website, although it doesnt matter.
    schedules: [
        {
            name: "Mon/Fri (Regular)",
            days: [1, 5],
            classes: [
                {
                    name: "1st Period",
                    startTime: {hours: 8, minutes:25},
                    endTime: {hours: 9, minutes:55}
                },
                {
                    name: "TSCT",
                    startTime: {hours: 9, minutes:55},
                    endTime: {hours: 10, minutes:10}
                },
                {
                    name: "2nd Period",
                    startTime: {hours: 10, minutes:15},
                    endTime: {hours: 11, minutes:45}
                },
                {
                    name: "Lunch",
                    startTime: {hours: 11, minutes:45},
                    endTime: {hours: 12, minutes:20}
                },
                {
                    name: "3rd Period",
                    startTime: {hours: 12, minutes:25},
                    endTime: {hours: 13, minutes:55}
                },
                {
                    name: "4th Period",
                    startTime: {hours: 14, minutes:00},
                    endTime: {hours: 15, minutes:30}
                }
            ]
        },
        {
            name: "Tues/Wed (Support Seminar)",
            days: [2, 3],
            classes: [
                {
                    name: "1st Period",
                    startTime: {hours: 8, minutes:25},
                    endTime: {hours: 9, minutes:47}
                },
                {
                    name: "TSCT",
                    startTime: {hours: 9, minutes:47},
                    endTime: {hours: 9, minutes:57}
                },
                {
                    name: "Support Seminar",
                    startTime: {hours: 10, minutes:02},
                    endTime: {hours: 10, minutes:34}
                },
                {
                    name: "2nd Period",
                    startTime: {hours: 10, minutes:39},
                    endTime: {hours: 12, minutes:01}
                },
                {
                    name: "Lunch",
                    startTime: {hours: 12, minutes:01},
                    endTime: {hours: 12, minutes:36}
                },
                {
                    name: "3rd Period",
                    startTime: {hours: 12, minutes:41},
                    endTime: {hours: 14, minutes:03}
                },
                {
                    name: "4th Period",
                    startTime: {hours: 14, minutes:8},
                    endTime: {hours: 15, minutes:30}
                }
            ],
        },
        {
            name: "Thursday (Early Release)",
            days: [4],
            classes: [
                {
                    name: "1st Period",
                    startTime: {hours: 8, minutes:25},
                    endTime: {hours: 9, minutes:50}
                },
                {
                    name: "TSCT",
                    startTime: {hours: 9, minutes:50},
                    endTime: {hours: 10, minutes:00}
                },
                {
                    name: "2nd Period",
                    startTime: {hours: 10, minutes:05},
                    endTime: {hours: 11, minutes:30}
                },
                {
                    name: "Lunch",
                    startTime: {hours: 11, minutes:30},
                    endTime: {hours: 12, minutes:05}
                },
                {
                    name: "3rd Period",
                    startTime: {hours: 12, minutes:10},
                    endTime: {hours: 13, minutes:35}
                },
                {
                    name: "4th Period",
                    startTime: {hours: 13, minutes:40},
                    endTime: {hours: 15, minutes:05}
                }
            ]
        }
    ]
};

/**
 * The standard run loop for updating the time and other time-related information on the site.
 *
 */
function update() {
    updateTime();
    if (scheduleExists()) {
        updateVariables()
        updateText();
        setTimeout(update, 500);
    }
}

/**
 * mostly useless method to update the currentScheduleIndex and currentClassPeriodIndex
 */
function updateVariables() {
    currentScheduleIndex = getCurrentScheduleIndex();
    currentClassPeriodIndex = getCurrentClassPeriodIndex();
    //document.getElementById('currentClass').innerHTML = data.schedule[selectedSchedule][currentClassPeriodIndex].name;
}

/**
 * Updates labels on the homepage
 */
function updateText() {
    document.getElementById('time').innerHTML = getCurrentTimeString();
    document.getElementById('date').innerHTML = getCurrentDateString();

    document.getElementById("schedule").innerHTML = getSummaryString();
    
    if (!isNoSchoolDay()) {
        if(!classIsInSession() && !isNoSchoolDay() && !checkGivenTimeIsBeforeCurrentTime(data.schedules[currentScheduleIndex].classes[0].startTime)) {
                
            document.getElementById("countdownLabel").innerHTML = "School starts in: "
            document.getElementById('timeToEndOfClass').innerHTML =  getTimeToStartOfSchoolString();
            
        } else {
            document.getElementById("countdownLabel").innerHTML = "...which ends in: ";
            document.getElementById('timeToEndOfClass').innerHTML =  getTimeToEndOfCurrentClassString();
        }
        
        document.getElementById("nextClass").innerHTML = getClassName(currentClassPeriodIndex+1)
        document.getElementById("currentClass").innerHTML = getClassName(currentClassPeriodIndex)
        //document.getElementById('sentence').innerHTML = getSummaryString()

        labels = document.getElementsByClassName("label")

        for (var i = 0; i < labels.length; i++) {
            labels[i].style.display = "block";
        }

        document.getElementById("viewScheduleLink").style.display = "block";
    
    } else {
        labels = document.getElementsByClassName("label")

        for (var i = 0; i < labels.length; i++) {
            labels[i].style.display = "none";
        }

        document.getElementById("viewScheduleLink").style.display = "none";
    }
}

/**
 * @returns the current schedule name or "No School" if there is no school scheduled today
 */
function getCurrentScheduleName() {
    if (!isNoSchoolDay()) {
        return data.schedules[currentScheduleIndex].name
    } else { return "No School"}
}

/**
 * this function checks to see if the currentClassPeriodIndex is valid (greater than -1), indicating that there is currently a scheduled class period happening
 *
 * @returns a boolean representing if class is in session
 */
function classIsInSession() {
    return (currentClassPeriodIndex >= 0 && !isNoSchoolDay())
    //might later want to add a check to make sure that currentClassPeriodIndex is not greater than the number of classes in the schedule for today
}

/**
 * this function checks to see if the current time is between the start of the first scheduled class and the end of the last scheduled class. This indicates that school is currently in session
 *
 * @returns a boolean representing if school is in session
 */
function schoolIsInSession() {

    return (checkStartTime(data.schedules[currentScheduleIndex].classes[0]) && checkEndTime(data.schedules[currentScheduleIndex].classes[data.schedules[currentScheduleIndex].classes.length-1]))
}

/**
 *  this function checks to see if the currentScheduleIndex is valid (greater than -1), indicating that there is a schedule for the day
 *
 * @returns true if there is no schedule that applies to today, false if there is
 */
function isNoSchoolDay() {
    return currentScheduleIndex <= -1;
    //might later want to add a check to make sure that currentScheduleIndex is not greater than the number of schedules
}


/**
 *  Checks if the schedule exists
 * @returns boolean describing if the schedule exists
 */
function scheduleExists() {
    return typeof data !== 'undefined'
}

function getSummaryString() {
    if (isNoSchoolDay()) {
        return "There's <strong>no class</strong> today!"
    } else {
        return "You are viewing the <strong>" + getCurrentScheduleName() + "</strong> schedule."
    }
    //other options
    //"it is currently ##:##:##. (period) ends in ##:##"
}



/**
 * This function updates the variables that keep track of the current time and date
 */
function updateTime() {
    currentDate = new Date();
    
    currentDay = currentDate.getDay(); // Sunday - Saturday : 0 - 6

    currentHours = currentDate.getHours();
    currentMinutes = currentDate.getMinutes();
    currentSeconds = currentDate.getSeconds();
}



/**
 *
 * @returns the current time as a formatted string
 */
function getCurrentTimeString() { return currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: !use24HourTime }) }

/**
 *
 * @returns the current date as a formatted string
 */
function getCurrentDateString() { 
return "on <strong>" + currentDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) + "</strong>"
}

/**
 * this function determines the index of the class period that is currently going on (if any)
 *
 * @returns an index for looking up the current class period, or -1 if there is no school today
 */
function getCurrentClassPeriodIndex() {
    if (isNoSchoolDay()) {
        //return immediately if there is no school today
        return -1
    }

    //using for over forEach() because we are breaking out of the loop early
    for (let i = 0; i < data.schedules[currentScheduleIndex].classes.length; i++) {
        if (checkStartTime(data.schedules[currentScheduleIndex].classes[i]) && checkEndTime(data.schedules[currentScheduleIndex].classes[i])) {
            return i
            break;//not sure if this is necessary so I included it anyway
        }
    }
    return -1
}

/**
 * this function determines the index of the schedule that applies to today (if any)
 *
 * @returns an index for looking up the current schedule, or -1 if there is no school today
 */
function getCurrentScheduleIndex() {
    //using for over forEach() because we are breaking out of the loop early
    for (let i = 0; i < data.schedules.length; i++) {
        if (data.schedules[i].days.includes(currentDay)) {
            return i
        }
    }
    //if execution reaches here, no schedules were found for today, so it must be a no school day
    return -1
}

/**
 * this function checks to see if the given time occurred before the current time, used for checking whether the current time falls within a scheduled class period
 *
 * @param {*} givenTime
 * @returns true if the given time occurred before the current time, false otherwise
 */
function checkGivenTimeIsBeforeCurrentTime( givenTime ) {
    if (givenTime.hours < currentHours || (givenTime.hours == currentHours && givenTime.minutes <= currentMinutes)) {
        //hours match and given minutes are before or the same as current minutes
        return true
    } else { return false }
}

/**
 * checks that the time a class was scheduled to start has already passed (i.e. the class has started)
 *
 * @param {*} classPeriod the object representing the class period to be checked
 * @returns true if the start time of the class has already passed, false otherwise
 */
function checkStartTime(classPeriod) { return checkGivenTimeIsBeforeCurrentTime(classPeriod.startTime)}

/**
 * checks that the time a class was scheduled to end has not already passed (i.e. the class has not yet ended)
 *
 * @param {*} classPeriod the object representing the class period to be checked
 * @returns true if the end time of the class has not already passed, false otherwise
 */
function checkEndTime(classPeriod) { return !checkGivenTimeIsBeforeCurrentTime(classPeriod.endTime)}


/**
 * this function gets the absolute value of the difference between the given time and the current time
 *
 * @param {*} time the time that you want to calculate the delta to from the current time
 * @returns the absolute value of the difference between the given time and the current time as an object 
 */
function getTimeDelta(time) {
    var currentTime = new Date(2000, 0, 1,  currentHours, currentMinutes, currentSeconds);
    var givenTime = new Date(2000, 0, 1, time.hours, time.minutes, 0);
    
                                                //order doesnt matter
    return convertMillisecondsToTime(Math.abs(givenTime - currentTime));
}

/**
 * converts a given number of milliseconds into a time object. Used for calculating the time between now and the end of the current class
 *
 * @param {*} milliseconds the number of milliseconds to convert
 * @returns a time object
 */
function convertMillisecondsToTime(milliseconds) {
    //theres probably a better way to do this using Date()
    time = {hours: 0, minutes:0, seconds:0, milliseconds: 0};
    //convert from milliseconds to H:M:S
    time.hours = Math.floor(milliseconds / 1000 / 60 / 60);
    milliseconds -= time.hours * 1000 * 60 * 60;
    time.minutes = Math.floor(milliseconds / 1000 / 60);
    milliseconds -= time.minutes * 1000 * 60;
    time.seconds = Math.floor(milliseconds / 1000);
    milliseconds -= time.seconds * 1000;
    //we dont need milliseconds so ignore this
    //time.milliseconds = milliseconds
    return time
}

/**
 *
 * @returns the time to the end of the current class as a string
 */
function getTimeToEndOfCurrentClassString() {
    if (classIsInSession()) {
        return getTimeStringFromObject(getTimeDelta(data.schedules[currentScheduleIndex].classes[currentClassPeriodIndex].endTime));
    } else {
        return "No Class"
    }
}

/**
 * This fucntion is used for calculating how long until school starts
 * @returns the time to the start of school as a string
 */
function getTimeToStartOfSchoolString() {
    if (!classIsInSession() && !isNoSchoolDay() && !checkGivenTimeIsBeforeCurrentTime(data.schedules[currentScheduleIndex].classes[0].startTime)) {
        return getTimeStringFromObject(getTimeDelta(data.schedules[currentScheduleIndex].classes[0].startTime));
    } else {
        return "No Class"
    }
}

/**
 *  this is a an unused method that was written for a feature that never got implemented and, as of this point in time, identical to @function getTimeToEndOfCurrentClassString()
 *
 * @returns the time to the start of the next class as a string
 */
function getTimeToStartOfNextClassString() {
    if (classIsInSession() && currentClassPeriodIndex+1 < data.schedule[selectedSchedule].classes.length ) {
        return getTimeStringFromObject(getTimeDelta(data.schedules[currentScheduleIndex].classes[currentClassPeriodIndex+1].startTime));
    } else {
        return "No More Classes"
    }
}


/**
 *  converts a time object into a string
 *
 * @param {*} timeObject the time object to convert
 * @param {boolean} [includeSeconds=true] a boolean representing whether seconds should be included in this string (i.e. for a countdown) or not (i.e. for displaying a fixed time)
 * @returns a String in either HH:MM format or HH:MM:SS format
 */
function getTimeStringFromObject(timeObject, includeSeconds=true) {
    if (includeSeconds) {
        //you can really tell how much i dont like to duplicate code here haha
        return getTimeStringFromObject(timeObject, false) + ":" + timeObject.seconds.toString().padStart(2, '0');
    } else {
        return timeObject.hours.toString().padStart(2, '0') + ":" + timeObject.minutes.toString().padStart(2, '0')
    }
}

/**
 *
 * @param {*} index the index of the class to return the name for
 * @returns returns the class name for the given index or "No Class" if there is no class in session
 */
function getClassName(index) {
    if (!isNoSchoolDay() && index >= 0 && index < data.schedules[currentScheduleIndex].classes.length) {
            return data.schedules[currentScheduleIndex].classes[index].name.toString()
    } else {
        return "No Class"
    }
}



/**
 * this function for populating the table on the schedule page
 *
 */
function populateScheduleTable() {
    // var body = document.getElementsByTagName('body')[0];
    var tbl = document.getElementById("scheduleTable")//createElement('table');
    // tbl.style.width = '100%';
    //tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');

        for (var i = 0; i < data.schedules[currentScheduleIndex].classes.length; i++) {
            if (data.schedules[currentScheduleIndex].classes[i].showInFullSchedule != false) {
            var tr = document.createElement('tr');
            //for (var j = 0; j < 3; j++) {

                var td = document.createElement('td');
                td.innerHTML = data.schedules[currentScheduleIndex].classes[i].name;
                td.style.fontWeight = "bold";
                //td.appendChild(document.createTextNode(data.schedules[currentScheduleIndex].classes[i].name))
                tr.appendChild(td)

                var td = document.createElement('td');
                td.innerHTML = getFormattedTimeStringFromObject(data.schedules[currentScheduleIndex].classes[i].startTime) + " - " + getFormattedTimeStringFromObject(data.schedules[currentScheduleIndex].classes[i].endTime)
                //td.appendChild(document.createTextNode(data.schedules[currentScheduleIndex].classes[i].name))
                tr.appendChild(td);

            // }
            tbdy.appendChild(tr);
        }
    }
    tbl.appendChild(tbdy);
   // body.appendChild(tbl)
  }


/**
 *  converts a time object into a formatted time string based on the user's time format (12/24 hour) preferences
 *
 * @param {*} timeObject the time object to convert to a string
 * @returns the string in either 12 or 24 hour format
 */
function getFormattedTimeStringFromObject(timeObject) {
    var pmString = "";

    //convert to 12 hour if necessary
    if (!use24HourTime && timeObject.hours > 12) {
        timeObject.hours -= 12;
        pmString = " PM";

    } else if (!use24HourTime) {
        pmString = " AM";
    }

    return getTimeStringFromObject(timeObject, false) + pmString;
}

/**
 *  Gets a value from HTML5 localStorage
 *
 * @param {*} key the key which the value is stored under
 * @param {boolean} [unsetDefault=false] the value to return if there was no item at that key. Default: false
 * @returns the value stored at the key or the value of unsetDefault if there was no value previously stored
 */
function getLocalStorageBoolean(key, unsetDefault=false) {
    if (localStorage.getItem(key) === null) {
        //key is not set
        return unsetDefault
    } else {
        //this is a better way to to convert the string from localStorage into a boolean for checkbox.checked. https://stackoverflow.com/a/264037
        return (localStorage.getItem(key) == "true")
    }
}

var a=document.getElementsByTagName("a");
    for(var i=0;i<a.length;i++)
    {
        if (a[i].classList.contains("navbutton")) {
            a[i].onclick=function()
            {
                window.location=this.getAttribute("href");
                return false
            }
        }
    }