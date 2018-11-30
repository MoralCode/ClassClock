var currentHours = 0;
var currentMinutes = 0; 
var currentSeconds = 0;

var currentClassPeriodIndex = -1;
//nextClassPeriodIndex

var selectedSchedule = 0;

if (typeof getCookie("schedule") !== 'undefined') {
    selectedSchedule = Number(getCookie("schedule"))
}

var data = {
    fullName: "",
    shortName: "",
    //order is as is on the school website
    schedule: [
        [
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
                startTime: {hours: 13, minutes:55},
                endTime: {hours: 14, minutes:00}
            },
            {
                name: "4th Period",
                startTime: {hours: 14, minutes:00},
                endTime: {hours: 15, minutes:30}
            }
        ],
        [
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
                startTime: {hours: 14, minutes:03},
                endTime: {hours: 14, minutes:8}
            },
            {
                name: "4th Period",
                startTime: {hours: 14, minutes:8},
                endTime: {hours: 15, minutes:30}
            }
        ],
        [
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
                startTime: {hours: 13, minutes:35},
                endTime: {hours: 13, minutes:40}
            },
            {
                name: "4th Period",
                startTime: {hours: 13, minutes:40},
                endTime: {hours: 15, minutes:05}
            }
        ]
    ]
};

// settings: {
//         militaryTime: true;
//     }


function update() {
    updateTime();

    if (typeof data !== 'undefined') {
        currentClassPeriodIndex = getCurrentClassPeriodIndex();
        //document.getElementById('currentClass').innerHTML = data.schedule[selectedSchedule][currentClassPeriodIndex].name;

        updateText();
        var t = setTimeout(update, 500);
    }
}

function updateText() {
    document.getElementById('timeToEndOfClass').innerHTML =  getTimeToEndOfCurrentClassString()
    document.getElementById("nextClass").innerHTML = getClassName(currentClassPeriodIndex+1)
    document.getElementById("currentClass").innerHTML = getClassName(currentClassPeriodIndex)
    //document.getElementById('sentence').innerHTML = getSummaryString()
    document.getElementById('time').innerHTML = getTimeString();
    document.getElementById("schedule").innerHTML = "You have selected the  <strong>" + getSelectedScheduleName() + "</strong> schedule."
}

function getSelectedScheduleName() {
    switch(selectedSchedule) {
        case 1:
            return "Tues/Wed (Support Seminar)"
        case 2:
            return "Thursday (Early Release)"
        default:
            return "Mon/Fri (Regular)"
    }
}

function getSummaryString() {
    if (currentClassPeriodIndex < 0) {
        return "School is not currently in session. Please check back later"
    } else {return "" }

    //other options
    //"it is currently ##:##:##. (period) ends in ##:##"
}

function updateTime() {
    var today = new Date();

    currentHours = today.getHours();
    currentMinutes = today.getMinutes();
    currentSeconds = today.getSeconds();
}

function getTimeString() { return currentHours.toString().padStart(2, '0') + ":" + currentMinutes.toString().padStart(2, '0') + ":" + currentSeconds.toString().padStart(2, '0'); }

function getCurrentClassPeriodIndex() {
    //using for over forEach() because we are breaking out of the loop early
    for (let i = 0; i < data.schedule[selectedSchedule].length; i++) {
        if (checkStartTime(data.schedule[selectedSchedule][i]) && checkEndTime(data.schedule[selectedSchedule][i])) {
            return i
            break;//not sure if this is necessary so I included it anyway
        }
    }
    //if execution reaches here, no class periods are in session, so therefore school must be out
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


function getTimeToTime(time) {
    if (currentClassPeriodIndex >= 0) {

        hoursUntilEnd = time.hours - currentHours;
        minutesUntilEnd = time.minutes - currentMinutes;
        secondsUntilEnd = time.seconds - currentSeconds; //because there are no seconds in the schedule, we assume it ends at the full minute

        return {hours: hoursUntilEnd, minutes: minutesUntilEnd, seconds: secondsUntilEnd};
    }
}

function getTimeToEndOfCurrentClassString() {
    if (currentClassPeriodIndex >= 0) {
        timeToEnd = getTimeToTime(data.schedule[selectedSchedule][currentClassPeriodIndex].endTime);
        return timeToEnd.hours.toString().padStart(2, '0') + ":" + timeToEnd.minutes.toString().padStart(2, '0') + ":" + timeToEnd.seconds.toString().padStart(2, '0');
    } else {
        return "No Class"
    }
}

function getTimeToStartOfNextClassString() {
    if (currentClassPeriodIndex >= 0 && currentClassPeriodIndex+1 < data.schedule[selectedSchedule].length ) {
        timeToEnd = getTimeToTime(data.schedule[selectedSchedule][currentClassPeriodIndex+1].startTime);
        return timeToEnd.hours.toString().padStart(2, '0') + ":" + timeToEnd.minutes.toString().padStart(2, '0') + ":" + timeToEnd.seconds.toString().padStart(2, '0');
    } else {
        return "No More Classes"
    }
}


function getClassName(index) {
    if (index >= 0 && index < data.schedule[selectedSchedule].length) {
        return data.schedule[selectedSchedule][index].name.toString()
    } else {
        return "No Class"
    }
}



//https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays=7) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

