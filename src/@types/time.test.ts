import { DateTime } from "luxon";
import Time from "./time";
import {school} from "../utils/testconstants";

const thisTime: Time = Time.fromTime(9, 31, 41);
const thisTimeUTC: Time = Time.fromISO("2022-06-16T09:31:41Z");
const preTime: Time = Time.fromTime(5, 18, 43);
const postTime: Time = Time.fromTime(13, 44, 39);

describe("Time", () => {
    it("can instantiate from milliseconds", () => {
        expect(Time.fromMilliseconds(34301000)).toEqual(thisTime);
    });

    it("can instantiate from DateTime", () => {
        let testTime1 = Time.fromDateTime(DateTime.fromISO("2022-06-16T09:31:41", { zone: school.getTimezone() }), school.getTimezone());
        let testTime2 = Time.fromDateTime(DateTime.fromISO("2022-07-16T09:31:41", { zone: school.getTimezone()}), school.getTimezone())
        
        expect(testTime1.hours).toEqual(thisTime.hours);
        expect(testTime1.minutes).toEqual(thisTime.minutes);
        expect(testTime1.seconds).toEqual(thisTime.seconds);

        //ensure dates are correctly stripped out so two different timestamps
        //can represent the same date
        expect(testTime1).toEqual(testTime2);

    });

    it("should get from string", () => {
        expect(Time.fromString("9:31:41")).toEqual(thisTime);
    });

    it("should get from string with leading zeroes", () => {
        expect(Time.fromString("08:04:09")).toEqual(Time.fromTime(8, 4, 9));
    });

    it("should get from string without seconds", () => {
        expect(Time.fromString("08:04")).toEqual(Time.fromTime(8, 4, 0));
    });

    it("should correct for values that are too large", () => {
        expect(Time.fromTime(45, 130, 118)).toEqual(Time.fromTime(21, 10, 58));
    });

    it("should correct for negative values", () => {
        expect(Time.fromTime(-9, -31, -41)).toEqual(thisTime);
    });

    it("should correct for values that are too large and negative", () => {
        expect(Time.fromTime(-45, -130, -118)).toEqual(Time.fromTime(21, 10, 58));
    });

    it("should return hours", () => {
        expect(thisTime.hours).toBe(9);
        // expect(thisTime.getHours()).toBe(9);
    });

    it("should return minutes", () => {
        expect(thisTime.minutes).toBe(31);
        // expect(thisTime.getMinutes()).toBe(31);
    });

    it("should return seconds", () => {
        expect(thisTime.seconds).toBe(41);
        // expect(thisTime.getSeconds()).toBe(41);
    });

    it("can detect if a time is before it", () => {
        expect(thisTime.isAfter(preTime)).toBe(true);
        expect(thisTime.isAfter(postTime)).toBe(false);
    });

    it("can detect if a time is after it", () => {
        expect(thisTime.isBefore(preTime)).toBe(false);
        expect(thisTime.isBefore(postTime)).toBe(true);
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

    it("has a json representation matching that of the string output", () => {
        expect(thisTime.toJSON()).toEqual(thisTime.getFormattedString(false, true));
        expect(thisTimeUTC.toJSON()).toEqual(thisTimeUTC.getFormattedString(false, true));
        
    });
});
