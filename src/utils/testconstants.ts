// This is not actually a unit test, just a central place to hold frequently-used constants that are often reused across tests

import Time from "../@types/time";
import School from "../@types/school";
import BellSchedule from "../@types/bellschedule";
import ClassPeriod from "../@types/classperiod";
import ClassClockService from "../services/classclock";


export const schoolId = "cb93cef79e9d11e986f2181dea92ad79";
export const schoolName = "The High School";
export const schoolAcronym = "THS";
export const schoolEndpoint = ClassClockService.baseURL + "/school/" + schoolId + "/";
export const schoolTimezone = "America/Cupertino";
export const passingPeriodName = "Transition Time";

export const bellScheduleId = "33d14ca5c91111e996ad181dea92ad79";
export const bellScheduleName = "Regular Schedule";
export const bellScheduleEndpoint =
    ClassClockService.baseURL + "/school/" +
    schoolId +
    "/bellschedule/" +
    bellScheduleId +
    "/";
export const bellScheduleDisplayName = "Display Name";


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


export const class2Name = "Second Period";

export const startTime2 = new Time(10, 5);
export const startTime2String = "10:05";
export const class2Duration = new Time(1, 30);
export const duringClass2 = new Time(11, 0);
export const endTime2 = new Time(11, 35);
export const endTime2String = "11:35";
export const afterClass2 = new Time(11, 40);

export const classPeriod2 = new ClassPeriod(
    class2Name,
    startTime2,
    endTime2,
    currentDate
);

export const classPeriod2JSON = {
    name: class2Name,
    startTime: startTime2String,
    endTime: endTime2String,
    creationDate: currentDate
};


// export const schoolInSession = new Date("2019-07-28T07:37:50.634Z");
export const noSchool = new Date("2019-07-27T07:37:50.634Z");
export const beforeSchoolHours = new Date("2019-07-28T0" + beforeClassString + ":00.000Z");
//start of class?
export const betweenClass = new Date("2019-07-28T" + afterClassString + ":50.634Z");
export const inClass = new Date("2019-07-28T0" + duringClassString + ":50.634Z");
//end of class?
export const afterSchoolHours = new Date("2019-07-28T12:00:50.634Z");


export const bellScheduleClasses = [classPeriod, classPeriod2];
export const bellScheduleClassesJSON = [classPeriodJSON, classPeriod2JSON];


export const bellSchedule = new BellSchedule(
    bellScheduleId,
    bellScheduleName,
    bellScheduleEndpoint,
    [
        new Date("2019-07-28T07:37:50.634Z"),
        new Date("2019-07-29T07:38:10.979Z"),
        new Date("2019-07-23T07:38:28.263Z")
    ],
    bellScheduleClasses,
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
           classes: bellScheduleClassesJSON,
           lastModified: currentDate
       };




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



/*
 * Variales for testing Redux and API calls
 * 
 */

 export const scheduleListEndpoint = ClassClockService.baseURL + "/school/" + schoolId + "/bellschedules/";

export const fakeSchoolResponse = {
           jsonapi: {
               version: "1.0"
           },
           data: {
               type: "school",
               id: schoolId,
               links: {
                   self: schoolEndpoint
               },
               attributes: {
                   owner_id: "google-oauth2|11658634A847763B38395",
                   creation_date: "2019-07-04T13:53:37",
                   acronym: schoolAcronym,
                   last_modified: "2019-12-15T13:24:00.058171",
                   full_name: schoolName,
                   alternate_freeperiod_name: passingPeriodName
               }
           }
       };



export const fakeBellScheduleListResponse = {
           jsonapi: {
               version: "1.0"
           },
           data: [
               {
                   type: "bellschedule",
                   id: bellScheduleId,
                   links: {
                       self: bellScheduleEndpoint
                   },
                   attributes: {
                       display_name: bellScheduleDisplayName,
                       full_name: bellScheduleName
                   },
                   relationships: {
                       schools: {
                           links: {
                               self: schoolEndpoint
                           }
                       }
                   }
               }
           ]
       };



export const fakeBellScheduleFullResponse = {
           jsonapi: {
               version: "1.0"
           },
           data: {
               type: "bellschedule",
               id: bellScheduleId,
               links: {
                   self: bellScheduleEndpoint
                       
               },
               attributes: {
                   creation_date: "2019-08-27T17:25:33",
                   display_name: bellScheduleDisplayName,
                   last_modified: "2019-08-27T17:25:33",
                   dates: ["2019-08-27", "2019-08-28"],
                   meeting_times: [
                       {
                           creation_date: "2019-08-27T17:40:43",
                           end_time: "10:05:00",
                           start_time: "09:50:00",
                           name: "Break"
                       },
                       {
                           creation_date: "2019-08-27T17:40:43",
                           end_time: "09:50:00",
                           start_time: "08:25:00",
                           name: "First Period"
                       },
                       {
                           creation_date: "2019-08-27T17:40:43",
                           end_time: "15:30:00",
                           start_time: "14:05:00",
                           name: "Fourth Period"
                       },
                       {
                           creation_date: "2019-08-27T17:40:43",
                           end_time: "12:30:00",
                           start_time: "11:55:00",
                           name: "Lunch"
                       },
                       {
                           creation_date: "2019-08-27T17:40:43",
                           end_time: "11:55:00",
                           start_time: "10:10:00",
                           name: "Second Period (Extended)"
                       },
                       {
                           creation_date: "2019-08-27T17:40:43",
                           end_time: "14:00:00",
                           start_time: "12:35:00",
                           name: "Third Period"
                       }
                   ],
                   full_name: bellScheduleName
               },
               relationships: {
                   schools: {
                       links: {
                           self: schoolEndpoint
                       }
                   }
               }
           }
       };
