import React from "react";
import ReactDOM from "react-dom";
import BellSchedule from "./bellschedule";
import ClassPeriod from "./classperiod";
import Time from "./time";

const classPeriod = new ClassPeriod(
    "first",
    new Time(9, 10),
    new Time(10, 25),
    new Date("2019-07-28T07:37:50.634Z")
);

const schedule = new BellSchedule(
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

describe("BellSchedule", () => {

    it("should get from JSON", () => {
        expect(
            BellSchedule.fromJson({
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
            })
        ).toEqual(schedule);
    });

    it("can get its identifier", () => {
        expect(schedule.getIdentifier()).toBe("1");
    });

    it("can get its name", () => {
        expect(schedule.getName() in ["Regular Schedule", "Display Name"]).toBeTruthy();
    });

    //got bored of testing getters...

    it("can get a class period for a given time", () => {
        //before
        expect(schedule.getClassPeriodForTime(new Time(9, 0))).toBeFalsy();

        //exactly start
        expect(schedule.getClassPeriodForTime(new Time(9, 10))).toEqual(classPeriod);

        //middle
        expect(schedule.getClassPeriodForTime(new Time(9, 30))).toEqual(classPeriod);

        //exactly end
        expect(schedule.getClassPeriodForTime(new Time(10, 25))).toEqual(classPeriod);
        
        //after
        expect(schedule.getClassPeriodForTime(new Time(11, 0))).toBeFalsy();
    });
});
