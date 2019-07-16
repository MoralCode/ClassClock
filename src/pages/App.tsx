import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import IPageInterface from "../utils/IPageInterface";
import "../App.css";

class App extends Component<IPageInterface, {}> {
    static FLASH_SUCCESS = "SUCCESS";
    static FLASH_INFO = "INFO";
    static FLASH_WARN = "WARNING";
    static FLASH_DANGER = "DANGER";

    public currentDate = new Date();

    public currentClassPeriodIndex = -1;
    //nextClassPeriodIndex

    public currentScheduleIndex = -1;
    public selectedSchoolIndex = 0;

    public use24HourTime = this.getLocalStorageBoolean("use24HourTime", false);

    public schools = [
        {
            fullName: "Lake Oswego High School",
            shortName: "LOHS",
            passingPeriodName: "Passing Period", //the name to use for time gaps in the schedule between classes
            //order is as is on the school website, although it doesnt matter.
            schedules: [
                {
                    name: "Mon/Fri (Regular)",
                    days: [1, 5],
                    classes: [
                        {
                            name: "1st Period",
                            startTime: { hours: 8, minutes: 25 },
                            endTime: { hours: 9, minutes: 55 }
                        },
                        {
                            name: "TSCT",
                            startTime: { hours: 9, minutes: 55 },
                            endTime: { hours: 10, minutes: 10 }
                        },
                        {
                            name: "2nd Period",
                            startTime: { hours: 10, minutes: 15 },
                            endTime: { hours: 11, minutes: 45 }
                        },
                        {
                            name: "Lunch",
                            startTime: { hours: 11, minutes: 45 },
                            endTime: { hours: 12, minutes: 20 }
                        },
                        {
                            name: "3rd Period",
                            startTime: { hours: 12, minutes: 25 },
                            endTime: { hours: 13, minutes: 55 }
                        },
                        {
                            name: "4th Period",
                            startTime: { hours: 14, minutes: 0 },
                            endTime: { hours: 15, minutes: 30 }
                        }
                    ]
                },
                {
                    name: "Tues/Wed (Support Seminar)",
                    days: [2, 3],
                    classes: [
                        {
                            name: "1st Period",
                            startTime: { hours: 8, minutes: 25 },
                            endTime: { hours: 9, minutes: 47 }
                        },
                        {
                            name: "TSCT",
                            startTime: { hours: 9, minutes: 47 },
                            endTime: { hours: 9, minutes: 57 }
                        },
                        {
                            name: "Support Seminar",
                            startTime: { hours: 10, minutes: 2 },
                            endTime: { hours: 10, minutes: 34 }
                        },
                        {
                            name: "2nd Period",
                            startTime: { hours: 10, minutes: 39 },
                            endTime: { hours: 12, minutes: 1 }
                        },
                        {
                            name: "Lunch",
                            startTime: { hours: 12, minutes: 1 },
                            endTime: { hours: 12, minutes: 36 }
                        },
                        {
                            name: "3rd Period",
                            startTime: { hours: 12, minutes: 41 },
                            endTime: { hours: 14, minutes: 3 }
                        },
                        {
                            name: "4th Period",
                            startTime: { hours: 14, minutes: 8 },
                            endTime: { hours: 15, minutes: 30 }
                        }
                    ]
                },
                {
                    name: "Thursday (Early Release)",
                    days: [4],
                    classes: [
                        {
                            name: "1st Period",
                            startTime: { hours: 8, minutes: 25 },
                            endTime: { hours: 9, minutes: 50 }
                        },
                        {
                            name: "TSCT",
                            startTime: { hours: 9, minutes: 50 },
                            endTime: { hours: 10, minutes: 0 }
                        },
                        {
                            name: "2nd Period",
                            startTime: { hours: 10, minutes: 5 },
                            endTime: { hours: 11, minutes: 30 }
                        },
                        {
                            name: "Lunch",
                            startTime: { hours: 11, minutes: 30 },
                            endTime: { hours: 12, minutes: 5 }
                        },
                        {
                            name: "3rd Period",
                            startTime: { hours: 12, minutes: 10 },
                            endTime: { hours: 13, minutes: 35 }
                        },
                        {
                            name: "4th Period",
                            startTime: { hours: 13, minutes: 40 },
                            endTime: { hours: 15, minutes: 5 }
                        }
                    ]
                }
            ]
        }
    ];

    /**
     * The standard run loop for updating the time and other time-related information on the site.
     *
     */
    public update() {
        this.updateTime();
        // document.getElementById('time').innerHTML = this.getCurrentTimeString();
        // document.getElementById('date').innerHTML = this.getCurrentDateString();

        if (typeof this.selectedSchoolIndex !== "undefined") {
            this.updateVariables();
            this.updateText();
            // document.getElementById("scheduleInfo").style.visibility = "visible";
        } else {
            // document.getElementById("scheduleInfo").style.visibility = "hidden";
        }

        setTimeout(this.update, 500);
    }

    /**
     * mostly useless method to update the currentScheduleIndex and currentClassPeriodIndex
     */
    public updateVariables() {
        this.currentScheduleIndex = this.getCurrentScheduleIndex();
        this.currentClassPeriodIndex = this.getCurrentClassPeriodIndex();
    }

    /**
     * Updates labels on the homepage
     */
    public updateText() {
        if (this.getCurrentTimeState() !== App.DAY_OFF_FLAG) {
            // document.getElementById("schedule").innerHTML = "You are viewing the <strong>" + this.getCurrentScheduleName() + "</strong> schedule"
            // document.getElementById("selectedSchoolDisplay").innerHTML = "from <strong>" + this.schools[this.selectedSchoolIndex].fullName + "</strong>.";
            // document.getElementById("viewScheduleLink").style.display = "block";
        }

        switch (this.getCurrentTimeState()) {
            case App.DAY_OFF_FLAG:
                // document.getElementById("schedule").innerHTML = "There's <strong>no class</strong> today!"
                // document.getElementById("viewScheduleLink").style.display = "none";

                let labels = document.getElementsByClassName("label");
                for (let i = 0; i < labels.length; i++) {
                    // labels[i].style.display = "none";
                }

                break;

            case App.OUTSIDE_SCHOOL_HOURS_FLAG:
                if (
                    this.compareTimes(
                        this.getCurrentTimeObject(),
                        this.schools[this.selectedSchoolIndex].schedules[
                            this.currentScheduleIndex
                        ].classes[0].startTime
                    ) === -1
                ) {
                    // document.getElementById("countdownLabel").innerHTML = "School starts in: "
                    // document.getElementById('timeToEndOfClass').innerHTML = this.getTimeToStartOfSchoolString();
                } else {
                    // document.getElementById('timeToEndOfClass').innerHTML = "No Class";
                }

                // document.getElementById("nextClass").innerHTML = this.getClassName(this.currentClassPeriodIndex+1)
                // document.getElementById("currentClass").innerHTML = this.getClassName(this.currentClassPeriodIndex)

                break;

            case App.SCHOOL_IN_CLASS_OUT_FLAG:
                // document.getElementById("nextClass").innerHTML = this.getClassName(this.getMostRecentlyStartedClassIndex()+1)
                // document.getElementById("currentClass").innerHTML = this.schools[this.selectedSchoolIndex].passingPeriodName
                // document.getElementById('timeToEndOfClass').innerHTML = this.getTimeStringFromObject(getTimeTo(this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[this.getMostRecentlyStartedClassIndex()+1].startTime));
                break;

            case App.CLASS_IN_SESSION_FLAG:
                // document.getElementById("countdownLabel").innerHTML = "...which ends in: ";
                // document.getElementById('timeToEndOfClass').innerHTML =  getTimeStringFromObject(getTimeTo(this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[getCurrentClassPeriodIndex()].endTime));

                // document.getElementById("nextClass").innerHTML = getClassName(currentClassPeriodIndex+1)
                // document.getElementById("currentClass").innerHTML = getClassName(currentClassPeriodIndex)
                break;

            default:
        }
    }

    /**
     * This public updates the variables that keep track of the current time and date
     */
    public updateTime() {
        this.currentDate = new Date();
    }

    /**
     * this public for populating the table on the schedule page
     *
     */
    public populateScheduleTable() {
        // var body = document.getElementsByTagName('body')[0];
        var tbl = document.getElementById("scheduleTable"); //createElement('table');
        // tbl.style.width = '100%';
        //tbl.setAttribute('border', '1');
        var tbdy = document.createElement("tbody");

        for (
            var i = 0;
            i <
            this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex]
                .classes.length;
            i++
        ) {
            var tr = document.createElement("tr");
            //for (var j = 0; j < 3; j++) {

            var td = document.createElement("td");
            td.innerHTML = this.schools[this.selectedSchoolIndex].schedules[
                this.currentScheduleIndex
            ].classes[i].name;
            td.style.fontWeight = "bold";
            //td.appendChild(document.createTextNode(data.schedules[this.currentScheduleIndex].classes[i].name))
            tr.appendChild(td);

            var td = document.createElement("td");
            td.innerHTML =
                this.getFormattedTimeStringFromObject(
                    this.schools[this.selectedSchoolIndex].schedules[
                        this.currentScheduleIndex
                    ].classes[i].startTime
                ) +
                " - " +
                this.getFormattedTimeStringFromObject(
                    this.schools[this.selectedSchoolIndex].schedules[
                        this.currentScheduleIndex
                    ].classes[i].endTime
                );
            //td.appendChild(document.createTextNode(data.schedules[this.currentScheduleIndex].classes[i].name))
            tr.appendChild(td);

            // }
            tbdy.appendChild(tr);
        }
        if (tbl !== null) {
            tbl.appendChild(tbdy);
        }
        // body.appendChild(tbl)
    }

    /**
     *  Gets a boolean value from HTML5 localStorage
     *
     * @param {*} key the key which the value is stored under
     * @param {boolean} [unsetDefault=false] the value to return if there was no item at that key. Default: false
     * @returns the value stored at the key or the value of unsetDefault if there was no value previously stored
     */
    public getLocalStorageBoolean(key: string, unsetDefault = false) {
        if (localStorage.getItem(key) === null) {
            //key is not set
            return unsetDefault;
        } else {
            //this is a better way to to convert the string from localStorage into a boolean for checkbox.checked. https://stackoverflow.com/a/264037
            return localStorage.getItem(key) === "true";
        }
    }

    /**
     *  Gets a Number from HTML5 LocalStorage
     *
     * @param {*} key the key which the Number is stored under
     * @returns the Number stored at the key if it exists, otherwise undefined.
     */
    public getLocalStorageIndex(key: string) {
        if (localStorage.getItem(key) !== null) {
            return Number(localStorage.getItem(key));
        } else {
            return undefined;
        }
    }

    /**
     * Causes a message to be displayed to the user.
     * This is useful for displaying error or succcess messages or otherwise warning users about something that may impact their use of classclock
     *
     * @param {*} message the text of the message to display to the user
     * @param {*} [type=FLASH_INFO] the flag of the style to use when displaying the message. Default: INFO
     * @param {number} [timeout=5000] the mumber of milliseconds to wait before the message disappears again. Anything less than 1 will disable the timeout
     */
    public flashMessage(message: string, type = App.FLASH_INFO, timeout = 5000) {
        var flash = document.getElementById("flash");

        if (flash !== null) {
            flash.innerHTML = message;
            // flash.style.visibility = "visible";
            flash.style.display = "normal";

            switch (type) {
                case App.FLASH_SUCCESS:
                    flash.className = "success";
                    break;

                case App.FLASH_WARN:
                    flash.className = "warning";
                    break;

                case App.FLASH_DANGER:
                    flash.className = "danger";
                    break;

                default:
                    //FLASH_INFO
                    flash.className = "info";
            }
            // maybe animate down or fade in

            if (timeout > 0) {
                setTimeout(function remove() {
                    // flash.style.visibility = "hidden";
                    if (flash !== null) {
                        flash.style.display = "none";
                    }
                }, timeout);
            }
        }
    }

    // var a=document.getElementsByTagName("a");
    //     for(var i=0;i<a.length;i++)
    //     {
    //         if (a[i].classList.contains("navbutton")) {
    //             a[i].onclick=public()
    //             {
    //                 window.location=this.getAttribute("href");
    //                 return false
    //             }
    //         }
    //     }

    render() {
        return (
            <div className="App">
                <a className="navbutton" href="settings.html">
                    <i className="fas fa-cog" />
                </a>
                <br />
                <p className="centered">It is currently: </p>
                <h1 className="centered time" id="time" />
                <p className="centered bottomSpace" id="date" />
                <section id="scheduleInfo" className="verticalFlex">
                    <p className="centered" id="schedule" />
                    <p className="centered" id="selectedSchoolDisplay" />
                    <a
                        href="schedule.html"
                        className="centered bottomSpace"
                        id="viewScheduleLink"
                    >
                        View Schedule
                    </a>
                    <p className="centered label">You are currently in: </p>
                    <h1 className="centered bottomSpace" id="currentClass" />
                    <p className="centered label" id="countdownLabel">
                        ...which ends in:{" "}
                    </p>
                    <h1
                        className="centered bottomSpace time bigger"
                        id="timeToEndOfClass"
                    />
                    <p className="centered label">Your next class period is: </p>
                    <h1 className="centered bottomSpace" id="nextClass" />
                </section>
            </div>
        );
    }
}

export default connect()(App);
