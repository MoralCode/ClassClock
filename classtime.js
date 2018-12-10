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
    //order is as is on the school website
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
                    name: "Passing Period",
                    showInFullSchedule: false,
                    startTime: {hours: 10, minutes:10},
                    endTime: {hours: 10, minutes:15}
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
                    name: "Passing Period",
                    showInFullSchedule: false,
                    startTime: {hours: 12, minutes:20},
                    endTime: {hours: 12, minutes:25}
                },
                {
                    name: "3rd Period",
                    startTime: {hours: 12, minutes:25},
                    endTime: {hours: 13, minutes:55}
                },
                {
                    name: "Passing Period",
                    showInFullSchedule: false,
                    startTime: {hours: 13, minutes:55},
                    endTime: {hours: 14, minutes:00}
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
                    name: "Passing Period",
                    showInFullSchedule: false,
                    startTime: {hours: 9, minutes:57},
                    endTime: {hours: 10, minutes:02}
                },
                {
                    name: "Support Seminar",
                    startTime: {hours: 10, minutes:02},
                    endTime: {hours: 10, minutes:34}
                },
                {
                    name: "Passing Period",
                    showInFullSchedule: false,
                    startTime: {hours: 10, minutes:34},
                    endTime: {hours: 10, minutes:39}
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
                    name: "Passing Period",
                    showInFullSchedule: false,
                    startTime: {hours: 12, minutes:36},
                    endTime: {hours: 12, minutes:41}
                },
                {
                    name: "3rd Period",
                    startTime: {hours: 12, minutes:41},
                    endTime: {hours: 14, minutes:03}
                },
                {
                    name: "Passing Period",
                    showInFullSchedule: false,
                    startTime: {hours: 14, minutes:03},
                    endTime: {hours: 14, minutes:8}
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
                    name: "Passing Period",
                    showInFullSchedule: false,
                    startTime: {hours: 10, minutes:00},
                    endTime: {hours: 10, minutes:05}
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
                    name: "Passing Period",
                    showInFullSchedule: false,
                    startTime: {hours: 12, minutes:05},
                    endTime: {hours: 12, minutes:10}
                },
                {
                    name: "3rd Period",
                    startTime: {hours: 12, minutes:10},
                    endTime: {hours: 13, minutes:35}
                },
                {
                    name: "Passing Period",
                    showInFullSchedule: false,
                    startTime: {hours: 13, minutes:35},
                    endTime: {hours: 13, minutes:40}
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

// settings: {
//         militaryTime: true;
//     }


function update() {
    updateTime();
    if (scheduleExists()) {
        updateVariables()
        updateText();
        setTimeout(update, 500);
    }
}

function updateVariables() {
    currentScheduleIndex = getCurrentScheduleIndex();
    currentClassPeriodIndex = getCurrentClassPeriodIndex();
    //document.getElementById('currentClass').innerHTML = data.schedule[selectedSchedule][currentClassPeriodIndex].name;
}

function updateText() {
    document.getElementById('time').innerHTML = getCurrentTimeString();
    document.getElementById('date').innerHTML = getCurrentDateString();

    document.getElementById("schedule").innerHTML = getSummaryString();
    
    if (!isNoSchoolDay()) {
        document.getElementById('timeToEndOfClass').innerHTML =  getTimeToEndOfCurrentClassString()
        document.getElementById("nextClass").innerHTML = getClassName(currentClassPeriodIndex+1)
        document.getElementById("currentClass").innerHTML = getClassName(currentClassPeriodIndex)
        //document.getElementById('sentence').innerHTML = getSummaryString()
    
    } else {
        labels = document.getElementsByClassName("label")

        for (var i = 0; i < labels.length; i++) {
            labels[i].style.display = "none";
        }

        document.getElementById("viewScheduleLink").style.display = "none";
    }
}

function getCurrentScheduleName() {
    if (!isNoSchoolDay()) {
        return data.schedules[currentScheduleIndex].name
    } else { return "No School"}
}

function classIsInSession() {
    return (currentClassPeriodIndex >= 0 && !isNoSchoolDay())
}

function isNoSchoolDay() {
    return currentScheduleIndex <= -1;
    //might later want to add a check to make sure that currentScheduleIndex is not greater than the number of schedules
}

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

function updateTime() {
    currentDate = new Date();
    
    currentDay = currentDate.getDay(); // Sunday - Saturday : 0 - 6

    currentHours = currentDate.getHours();
    currentMinutes = currentDate.getMinutes();
    currentSeconds = currentDate.getSeconds();
}

function getCurrentTimeString() { return currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: !use24HourTime }) }

function getCurrentDateString() { 
return "on <strong>" + currentDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) + "</strong>"
}

function getCurrentClassPeriodIndex() {
    if (!isNoSchoolDay()) {
        //using for over forEach() because we are breaking out of the loop early
        for (let i = 0; i < data.schedules[currentScheduleIndex].classes.length; i++) {
            if (checkStartTime(data.schedules[currentScheduleIndex].classes[i]) && checkEndTime(data.schedules[currentScheduleIndex].classes[i])) {
                return i
                break;//not sure if this is necessary so I included it anyway
            }
        }
    } else {
        //if execution reaches here, no class periods are in session, so therefore school must be out
        return -1
    }
}

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

function checkGivenTimeIsBeforeCurrentTime( givenTime ) {
    if (givenTime.hours < currentHours) {
        //given time is before current time
        return true
    } else if (givenTime.hours == currentHours && givenTime.minutes <= currentMinutes) {
        //hours match and given minutes are before or the same as current minutes
        return true
    } else { return false }
}

function checkStartTime(classPeriod) { return checkGivenTimeIsBeforeCurrentTime(classPeriod.startTime)}
function checkEndTime(classPeriod) { return !checkGivenTimeIsBeforeCurrentTime(classPeriod.endTime)}


/**
function getTimeDelta(time) {
    var currentTime = new Date(2000, 0, 1,  currentHours, currentMinutes, currentSeconds);
    var givenTime = new Date(2000, 0, 1, time.hours, time.minutes, 0);
    
                                                //order doesnt matter
    return convertMillisecondsToTime(Math.abs(givenTime - currentTime));
}

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

function getTimeToEndOfCurrentClassString() {
    if (classIsInSession()) {
        return getTimeStringFromObject(getTimeDelta(data.schedules[currentScheduleIndex].classes[currentClassPeriodIndex].endTime));
    } else {
        return "No Class"
    }
}

function getTimeToStartOfNextClassString() {
    if (classIsInSession() && currentClassPeriodIndex+1 < data.schedule[selectedSchedule].classes.length ) {
        return getTimeStringFromObject(getTimeDelta(data.schedules[currentScheduleIndex].classes[currentClassPeriodIndex+1].startTime));
    } else {
        return "No More Classes"
    }
}


function getTimeStringFromObject(timeObject, includeSeconds=true) {
    if (includeSeconds) {
        //you can really tell how much i dont like to duplicate code here haha
        return getTimeStringFromObject(timeObject, false) + ":" + timeObject.seconds.toString().padStart(2, '0');
    } else {
        return timeObject.hours.toString().padStart(2, '0') + ":" + timeObject.minutes.toString().padStart(2, '0')
    }
}

function getClassName(index) {
    if (classIsInSession() && index < data.schedules[currentScheduleIndex].classes.length) {
            return data.schedules[currentScheduleIndex].classes[index].name.toString()
    } else {
        return "No Class"
    }
}



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
                td.innerHTML = data.schedules[currentScheduleIndex].classes[i].name
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