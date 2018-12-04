var currentDay = 0;
var currentHours = 0;
var currentMinutes = 0; 
var currentSeconds = 0;
var currentDate;

var currentClassPeriodIndex = -1;
//nextClassPeriodIndex

var currentScheduleIndex = -1;


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
        }
    ]
};

// settings: {
//         militaryTime: true;
//     }


function update() {
    updateTime();

    if (typeof data !== 'undefined') {
        updateVariables()
        updateText();
        var t = setTimeout(update, 500);
    }
}

function updateVariables() {
    currentScheduleIndex = getCurrentScheduleIndex();
    currentClassPeriodIndex = getCurrentClassPeriodIndex();
    //document.getElementById('currentClass').innerHTML = data.schedule[selectedSchedule][currentClassPeriodIndex].name;
}

function updateText() {
    document.getElementById('timeToEndOfClass').innerHTML =  getTimeToEndOfCurrentClassString()
    document.getElementById("nextClass").innerHTML = getClassName(currentClassPeriodIndex+1)
    document.getElementById("currentClass").innerHTML = getClassName(currentClassPeriodIndex)
    //document.getElementById('sentence').innerHTML = getSummaryString()
    document.getElementById('time').innerHTML = getCurrentTimeString();
    document.getElementById("schedule").innerHTML = "Today is a <strong>" + getCurrentScheduleName() + "</strong> schedule."
}

function getCurrentScheduleName() {
    return data.schedules[currentScheduleIndex].name
}

function classIsInSession() {
    return (currentClassPeriodIndex >= 0 && currentScheduleIndex >= 0)
}

function getSummaryString() {
    if (classIsInSession()) {
        return "School is not currently in session. Please check back later"
    } else {return "" }

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

function getCurrentTimeString() { return currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) }

function getCurrentClassPeriodIndex() {
    //using for over forEach() because we are breaking out of the loop early
    for (let i = 0; i < data.schedules[currentScheduleIndex].classes.length; i++) {
        if (checkStartTime(data.schedules[currentScheduleIndex].classes[i]) && checkEndTime(data.schedules[currentScheduleIndex].classes[i])) {
            return i
            break;//not sure if this is necessary so I included it anyway
        }
    }
    //if execution reaches here, no class periods are in session, so therefore school must be out
    return -1
}

function getCurrentScheduleIndex() {
    //using for over forEach() because we are breaking out of the loop early
    for (let i = 0; i < data.schedules.length; i++) {
        if (currentDay in data.schedules[i].days) {
            return i
            break;//not sure if this is necessary so I included it anyway
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


function getTimeToTime(time) {
    if (classIsInSession()) {

        hoursUntilEnd = time.hours - currentHours;
        minutesUntilEnd = time.minutes - currentMinutes;

        if (minutesUntilEnd < 0) {
            hoursUntilEnd-=1
            minutesUntilEnd = 59+minutesUntilEnd
        }

        if (typeof time.seconds == 'undefined' ) {
            secondsUntilEnd = 60-currentSeconds
        }else {
            secondsUntilEnd = time.seconds - currentSeconds; //because there are no seconds in the schedule, we assume it ends at the full minute
        }

        return {hours: hoursUntilEnd, minutes: minutesUntilEnd, seconds: secondsUntilEnd};
    }
}

function getTimeToEndOfCurrentClassString() {
    if (classIsInSession()) {
        timeToEnd = getTimeToTime(data.schedules[currentScheduleIndex].classes[currentClassPeriodIndex].endTime);
        return timeToEnd.hours.toString().padStart(2, '0') + ":" + timeToEnd.minutes.toString().padStart(2, '0') + ":" + timeToEnd.seconds.toString().padStart(2, '0');
    } else {
        return "No Class"
    }
}

function getTimeToStartOfNextClassString() {
    if (classIsInSession() && currentClassPeriodIndex+1 < data.schedule[selectedSchedule].classes.length ) {
        timeToEnd = getTimeToTime(data.schedules[currentScheduleIndex].classes[currentClassPeriodIndex+1].startTime);
        return timeToEnd.hours.toString().padStart(2, '0') + ":" + timeToEnd.minutes.toString().padStart(2, '0') + ":" + timeToEnd.seconds.toString().padStart(2, '0');
    } else {
        return "No More Classes"
    }
}


function getClassName(index) {
    if (index >= 0 && index < data.schedules[currentScheduleIndex].classes.length) {
        return data.schedules[currentScheduleIndex].classes[index].name.toString()
    } else {
        return "No Class"
    }
}

// function showSchedule() {
//     for (let i = 0; i < data.schedules[currentScheduleIndex].classes.length; i++) {

//         classPeriod = data.schedules[currentScheduleIndex].classes[i];


        
//     }

// }



function showSchedule() {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    // tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');

    for (var i = 0; i < data.schedules[currentScheduleIndex].classes.length; i++) {
        var tr = document.createElement('tr');
        
        //for (var j = 0; j < 3; j++) {

            var td = document.createElement('td');
            td.innerHTML = data.schedules[currentScheduleIndex].classes[i].name
            //td.appendChild(document.createTextNode(data.schedules[currentScheduleIndex].classes[i].name))
            tr.appendChild(td)

            var td = document.createElement('td');
            td.innerHTML = getTimeStringFromObject(data.schedules[currentScheduleIndex].classes[i].startTime)
            //td.appendChild(document.createTextNode(data.schedules[currentScheduleIndex].classes[i].name))
            tr.appendChild(td)

            
            var td = document.createElement('td');
            td.innerHTML = getTimeStringFromObject(data.schedules[currentScheduleIndex].classes[i].endTime)
            //td.appendChild(document.createTextNode(data.schedules[currentScheduleIndex].classes[i].name))
            tr.appendChild(td)

        // }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
  }


  function getTimeStringFromObject(timeObject) {
    return timeObject.hours.toString().padStart(2, '0') + ":" + timeObject.minutes.toString().padStart(2, '0')
  }