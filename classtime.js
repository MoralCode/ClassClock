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
    //this function gets the absolute value of the difference between now and the current time
    if (classIsInSession()) {

        difference = {hours: 0, minutes:0, seconds:0};
        
        var currentTime = new Date(2000, 0, 1,  currentHours, currentMinutes, currentSeconds);
        var givenTime = new Date(2000, 0, 1, time.hours, time.minutes, 0);
        
        var msec = givenTime - currentTime; //order doesnt matter
        msec = Math.abs(msec);

        //convert from milliseconds to H:M:S
        difference.hours = Math.floor(msec / 1000 / 60 / 60);
        msec -= difference.hours * 1000 * 60 * 60;
        difference.minutes = Math.floor(msec / 1000 / 60);
        msec -= difference.minutes * 1000 * 60;
        difference.seconds = Math.floor(msec / 1000);
        msec -= difference.seconds * 1000;

        // if (typeof time.seconds == 'undefined' ) {
        //     secondsUntilEnd = 59-currentSeconds
        // }else {
        //     secondsUntilEnd = time.seconds - currentSeconds; //because there are no seconds in the schedule, we assume it ends at the full minute
        // }

        return difference;
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
                td.innerHTML = getTimeStringFromObject(data.schedules[currentScheduleIndex].classes[i].startTime) + " - " + getTimeStringFromObject(data.schedules[currentScheduleIndex].classes[i].endTime)
                //td.appendChild(document.createTextNode(data.schedules[currentScheduleIndex].classes[i].name))
                tr.appendChild(td);

            // }
            tbdy.appendChild(tr);
        }
    }
    tbl.appendChild(tbdy);
   // body.appendChild(tbl)
  }


  function getTimeStringFromObject(timeObject) {
      var pmString = " AM";
      var hours = timeObject.hours;

      if (!use24HourTime) {
          //im making this variable because i dont know if javascript will mutate the original variable or not.
        if(hours > 12) {
            hours -= 12;
            pmString = " PM";
        }
      } else {
          pmString = "";
      }
      return hours.toString().padStart(2, '0') + ":" + timeObject.minutes.toString().padStart(2, '0') + pmString;
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