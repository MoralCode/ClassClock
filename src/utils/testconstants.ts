// This is not actually a unit test, just a central place to hold frequently-used constants that are often reused across tests

import Time from "../@types/time";
import School from "../@types/school";
import BellSchedule from "../@types/bellschedule";
import ClassPeriod from "../@types/classperiod";





export const currentDate = new Date("2019-07-28T07:37:50.634Z");

export const className = "First Period";

export const beforeClass = new Time(8, 0);
export const beforeClassString = "8:00"
export const startTime = new Time(8, 25);
export const startTimeString = "8:25";
export const classDuration = new Time(1, 30);
export const duringClass = new Time(9, 0);
export const duringClassString = "9:00";
export const endTime = new Time(9, 55);
export const endTimeString = "9:55";
export const afterClass = new Time(10, 0);
export const afterClassString = "10:00";

export const classPeriod = new ClassPeriod(className, startTime, endTime, currentDate);

export const classPeriodJSON = {
           name: className,
           startTime: startTimeString,
           endTime: endTimeString,
           creationDate: currentDate
       };

export const bellScheduleId = "1";
export const bellScheduleName = "Regular Schedule";
export const bellScheduleEndpoint = "/path/to/sched";
export const bellScheduleDisplayName = "Display Name";


export const bellSchedule = new BellSchedule(
    bellScheduleId,
    bellScheduleName,
    bellScheduleEndpoint,
    [
        new Date("2019-07-28T07:37:50.634Z"),
        new Date("2019-07-29T07:38:10.979Z"),
        new Date("2019-07-23T07:38:28.263Z")
    ],
    [classPeriod],
    currentDate
);

export const bellScheduleJSON = {
           id: bellScheduleId,
           name: bellScheduleName,
           endpoint: bellScheduleEndpoint,
           dates: [
               "2019-07-28T07:37:50.634Z",
               "2019-07-29T07:38:10.979Z",
               "2019-07-23T07:38:28.263Z"
           ],
           classes: [classPeriodJSON],
           lastModified: currentDate
       };


export const schoolId = "10";
export const schoolName = "The High School";
export const schoolAcronym = "THS";
export const schoolEndpoint = "/some/endpoint";
export const schoolTimezone = "America/Cupertino";
export const passingPeriodName = "Transition Time";

export const school = new School(
    schoolId,
    schoolName,
    schoolAcronym,
    schoolEndpoint,
    schoolTimezone,
    [bellSchedule],
    passingPeriodName,
    currentDate,
    currentDate
);

export const schoolJSON = {
           id: schoolId,
           name: schoolName,
           acronym: schoolAcronym,
           endpoint: schoolEndpoint,
           timezone: schoolTimezone,
           schedules: [bellScheduleJSON],
           passingPeriodName,
           creationDate: currentDate,
           lastModified: currentDate
       };
