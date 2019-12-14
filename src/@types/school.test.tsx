import React from "react";
import ReactDOM from "react-dom";
import BellSchedule from "./bellschedule";
import ClassPeriod from "./classperiod";
import Time from "./time";
import School from "./school";

const classPeriod = new ClassPeriod(
    "first",
    new Time(9, 10),
    new Time(10, 25),
    new Date("2019-07-28T07:37:50.634Z")
);

const bellSchedule = new BellSchedule(
    "1",
    "Regular Schedule",
    "/path/to/sched",
    [
        new Date("2019-07-28T07:37:50.634Z"),
        new Date("2019-07-29T07:38:10.979Z"),
        new Date("2019-07-23T07:38:28.263Z")
    ],
    [classPeriod],
    new Date("2019-07-28T07:37:50.634Z"),
    "Display Name"
);

const school = new School(
    "10",
    "The High School",
    "THS",
    "/some/endpoint",
    "America/Cupertino",
    [bellSchedule],
    "Transition Time",
    new Date("2019-07-28T07:37:50.634Z"),
    new Date("2019-07-28T07:37:50.634Z")
);

describe("School", () => {
    it("should get from JSON", () => {
        expect(
            School.fromJson({
                id: "10",
                name: "The High School",
                acronym: "THS",
                endpoint: "/some/endpoint",
                timezone: "America/Cupertino",
                schedules: [
                    {
                        id: "1",
                        name: "Regular Schedule",
                        endpoint: "/path/to/sched",
                        dates: [
                            "2019-07-28T07:37:50.634Z",
                            "2019-07-29T07:38:10.979Z",
                            "2019-07-23T07:38:28.263Z"
                        ],
                        classes: [
                            {
                                name: "first",
                                startTime: "09:10",
                                endTime: "10:25",
                                creationDate: "2019-07-28T07:37:50.634Z"
                            }
                        ],
                        displayName: "Display Name",
                        lastUpdatedDate: "2019-07-28T07:37:50.634Z"
                    }
                ],
                passingPeriodName: "Transition Time",
                creationDate: "2019-07-28T07:37:50.634Z",
                lastUpdatedDate: "2019-07-28T07:37:50.634Z"
            })
        ).toEqual(school);
    });

    test("can get schedule for date", () => {
        expect(school.getScheduleForDate(new Date("2019-07-28T07:37:50.634Z"))).toEqual(
            bellSchedule
        );
    });

    test("can check if school is in session", () => {
        expect(school.isInSession(new Date("2019-07-28T09:15:50.634Z"))).toBeTruthy();
    });
});
