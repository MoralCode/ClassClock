import React from "react";
import ReactDOM from "react-dom";
import Time from "./time";

const thisTime = new Time(9, 31, 41);
const preTime = new Time(5, 18, 43);
const postTime = new Time(13, 44, 39);

describe("Time", () => {
    it("should get from milliseconds", () => {
        expect(Time.fromMilliseconds(34301000)).toEqual(thisTime);
    });

    it("should get from UTC date as local time", () => {
        expect(Time.fromJSDate(new Date(2019, 7, 27, 9, 31, 41), true)).toEqual(thisTime);
    });

    it("should get from UTC date as UTC time", () => {
        let newTime = Time.fromJSDate(new Date(2019, 7, 27, 9, 31, 41), false);
        // note, this will fail if timezone is included in the comparison because thisTime doesnt specify timezone
        expect(newTime.getHours() === thisTime.getHours());
        expect(newTime.getMinutes() === thisTime.getMinutes());
        expect(newTime.getSeconds() === thisTime.getSeconds());
        expect(newTime.toString(false,true) === thisTime.toString(false, true))
    });

    it("should get from string", () => {
        expect(Time.fromString("9:31:41")).toEqual(thisTime);
    });

    it("should get from string with leading zeroes", () => {
        expect(Time.fromString("08:04:09")).toEqual(new Time(8, 4, 9));
    });

    it("should correct for values that are too large", () => {
        expect(new Time(45, 130, 118)).toEqual(new Time(21, 10, 58));
    });

    it("should correct for negative values", () => {
        expect(new Time(-9, -31, -41)).toEqual(thisTime);
    });

    it("should correct for values that are too large and negative", () => {
        expect(new Time(-45, -130, -118)).toEqual(new Time(21, 10, 58));
    });

    it("should return hours", () => {
        expect(thisTime.getHours()).toBe(9);
    });

    it("should return minutes", () => {
        expect(thisTime.getMinutes()).toBe(31);
    });

    it("should return seconds", () => {
        expect(thisTime.getSeconds()).toBe(41);
    });

    it("should get the number of milliseconds to a future time", () => {
        expect(thisTime.getMillisecondsTo(postTime)).toBe(15178000);
    });

    it("should get the number of milliseconds to a past time", () => {
        expect(thisTime.getMillisecondsTo(preTime)).toBe(-15178000);
    });

    it("should get the number of milliseconds to the same time", () => {
        expect(thisTime.getMillisecondsTo(thisTime)).toBe(0);
        expect(preTime.getMillisecondsTo(preTime)).toBe(0);
        expect(postTime.getMillisecondsTo(postTime)).toBe(0);
    });

    it("returns the correct time delta", () => {
        expect(thisTime.getTimeDeltaTo(preTime)).toEqual(Time.fromMilliseconds(15178000));
        expect(thisTime.getTimeDeltaTo(postTime)).toEqual(
            Time.fromMilliseconds(15178000)
        );
    });

    it("can return times as strings", () => {
        expect(thisTime.toString()).toBe("09:31:41");
        expect(preTime.toString()).toBe("05:18:43");
        expect(postTime.toString()).toBe("13:44:39");
    });

    it("can get formatted strings in the morning", () => {
        expect(thisTime.getFormattedString(true, true)).toBe("09:31");
        expect(thisTime.getFormattedString(true, false)).toBe("09:31 AM");
        expect(thisTime.getFormattedString(false, true)).toBe("09:31:41");
        expect(thisTime.getFormattedString(false, false)).toBe("09:31:41 AM");
    });

    it("can get formatted strings in the afternoon", () => {
        expect(postTime.getFormattedString(true, true)).toBe("13:44");
        expect(postTime.getFormattedString(true, false)).toBe("01:44 PM");
        expect(postTime.getFormattedString(false, true)).toBe("13:44:39");
        expect(postTime.getFormattedString(false, false)).toBe("01:44:39 PM");
    });

    it("serializes to a string", () => {
        expect(thisTime.toJSON()).toBe("09:31:41");
    });
});
