var currentHours = 0;
var currentMinutes = 0; 
var currentSeconds = 0;

var currentClassPeriodIndex = -1;

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
                name: "2nd Period",
                startTime: {hours: 14, minutes:30},
                endTime: {hours: 16, minutes:50}
            }
        ],
        [],
        []
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
    document.getElementById('sentence').innerHTML = getSummaryString()
    document.getElementById('time').innerHTML = getTimeString();
}

function getSummaryString() {
    if (currentClassPeriodIndex >= 0) {
        return "It is currently <strong>" + getTimeString() + "</strong>. You are currently in <strong>" + schedule[selectedSchedule][currentClassPeriodIndex].name + "</strong>. You have <strong>" + getTimeToEndOfCurrentClassString() + "</strong> until this class ends."
    } else {
        return "School is not currently in session. Please check back later"
    }

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


function getTimeToEndOfCurrentClass() {
    if (currentClassPeriodIndex >= 0) {
        currentClassEndTime = data.schedule[selectedSchedule][currentClassPeriodIndex].endTime;

        hoursUntilEnd = currentClassEndTime.hours - currentHours;
        minutesUntilEnd = currentClassEndTime.minutes - currentMinutes;
        secondsUntilEnd = 60 - currentSeconds; //because there are no seconds in the schedule, we assume it ends at the full minute

        return {hours: hoursUntilEnd, minutes: minutesUntilEnd, seconds: secondsUntilEnd};
    } else {
        return {hours: 0, minutes: 0, seconds: 0}; //maybe add time until next class?
    }
}

function getTimeToEndOfCurrentClassString() {
    timeToEnd = getTimeToEndOfCurrentClass();
    return timeToEnd.hours.toString().padStart(2, '0') + ":" + timeToEnd.minutes.toString().padStart(2, '0') + ":" + timeToEnd.seconds.toString().padStart(2, '0');
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

