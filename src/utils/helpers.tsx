import { DateTime, Interval } from "luxon";
import School from "../@types/school";
//todo, replace timeComparisons with luxon Interval
import { TimeComparisons, TimeStates } from "./enums";
import ClassPeriod from "../@types/classperiod";
import BellSchedule from "../@types/bellschedule";
import { useState } from "react";
import { RateLimitError } from "./errors";
import Time from "../@types/time";

//https://stackoverflow.com/a/55862077
export const useForceUpdate = () => {
    const [, setTick] = useState(0);
    const update = () => {
        setTick((tick: number) => tick + 1);
    };
    return update;
};

export function getValueIfKeyInList(list: string[], object: any) {
    for (const key of list) {
        if (object.hasOwnProperty(key)) {
            return object[key];
        }
    }
}

export function objectKeysToSnakeCase(object: object) {
    let copyObject: any = Object.assign({}, object);

    //iterate over object
    for (const [objKey, objValue] of Object.entries(copyObject)) {
        // if (value.hasOwnProperty(objKey))
        const snake = toSnakeCase(objKey);
        if (objKey !== snake) {
            copyObject[snake] = objValue;
            delete copyObject[objKey];
        }
    }
    return copyObject;
}

// https://stackoverflow.com/a/54246525/
export function toSnakeCase(input: string) {
    // https://stackoverflow.com/a/55521416/
    const ALPHA = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

    function isAlpha(char: string) {
        return ALPHA.has(char);
    }
    
    return input.split('').map((character, index) => {
        if (character == character.toUpperCase() && isAlpha(character)) {
            return (index != 0 ? '_': '') + character.toLowerCase();
        } else {
            return character;
        }
    }).join('');
}

export function getCurrentDate() {
    return DateTime.local();
}

export function sortClassesByStartTime(classes: ClassPeriod[]) {
    return classes.sort((a, b) => b.getStartTime().getMillisecondsTo(a.getStartTime()));
}

/**
 * @returns a flag that represents the current chunk of time categorically
 */
export function getTimeStateForDateAtSchool(date: DateTime, school: School) {
    const currentBellSchedule = school.getScheduleForDate(date);

    //there is no schedule that applies today
    if (!currentBellSchedule) {
        return TimeStates.DAY_OFF;
    }

    const currentClassPeriod = currentBellSchedule.getClassPeriodForTime(date, school.getTimezone());

    //it is a school day but it is not school hours
    if (!school.isInSession(date)) {
        return TimeStates.OUTSIDE_SCHOOL_HOURS;
    }

    //the current time lies between the start of the first schedules class and the end of the last
    else if (school.isInSession(date) && currentClassPeriod === undefined) {
        return TimeStates.SCHOOL_IN_CLASS_OUT;
    }

    //the current time lies within a scheduled class period
    else if (currentClassPeriod !== undefined) {
        return TimeStates.CLASS_IN_SESSION;
    }
}

/**
 * This export function checks if the current time is between the two given times
 * This is useful for checking which class period you are currently in or for checking if school is in session.
 *
 * @param {*} checkTime the time that the check results are returned for
 * @param {*} startTime the start time of the range to check
 * @param {*} endTime the end time of the range to check
 *
 * @returns -1 if checkTime is before range, 0 if checkTime is within range, 1 if checkTime is after range
 */
export function checkTimeRange(checkTime: Time, startTime: Time, endTime: Time): TimeComparisons {

    // swap the values if startTime is after end time
    if (startTime.isAfter(endTime)) {
        let t = startTime
        startTime = endTime
        endTime = t
    }

    if (checkTime.isBefore(startTime)) {
        return TimeComparisons.IS_BEFORE;
    } else if (checkTime.isAfter(endTime)) {
        return TimeComparisons.IS_AFTER;
    } else {
        return TimeComparisons.IS_DURING_OR_EXACTLY
    }
}


/**
 * Calculates the larger of either the exponential backoff or the given minimum delay
 * 
 * modified from https://medium.com/swlh/retrying-and-exponential-backoff-with-promises-1486d3c259
 * @export
 * @param {number} retryCount the number of times the request has already been re-tried
 * @param {number} [minDelay=0] the minimum amount of delay
 * @returns a number that can be used as the delay (units are arbitrary)
 */
export function calculateDelay(retryCount: number, minDelay:number = 0) {
    //exponential backoff
    return Math.max(10 ** retryCount, minDelay)
}

/**
 * Delays by the given number of milliseconds
 * 
 * modified from https://medium.com/swlh/retrying-and-exponential-backoff-with-promises-1486d3c259
 * @export
 * @param {number} duration the number of milliseconds to delay
 * @returns
 */
export const delay = async (duration:number) =>
    new Promise(resolve => setTimeout(resolve, duration));

/**
 * Retries a promise a given number of times if it rejects
 *
 * based on https://dev.to/ycmjason/javascript-fetch-retry-upon-failure-3p6g
 * @export
 * @param {Promise<any>} promise the promise to retry on rejection
 * @param {number} [maxRetries=5] the maximum number of times to retry before giving up
 * @param {number} [tryCount=1] the number of tries that have already been attempted
 * @param {number} [minimumWait=100] the minimum amount of time to wait between requests in milleseconds
 * @returns {Promise<any>} the given promise with the capability to retry in case it rejects
 */
export async function promiseRetry(promise: Promise<any>, maxRetries = 5, tryCount=1, minimumWait = 100): Promise<any> {
    return promise.catch(async function (error) {
        if (maxRetries === tryCount) throw error;
        if (error instanceof RateLimitError) {
            minimumWait = error.wait
        }
        await delay(calculateDelay(tryCount, minimumWait))
        return promiseRetry(promise, maxRetries, tryCount + 1);
    });
}

/**
 * Calculates how long to wait before sending retrying request when receiving 429 Too Many Requests
 * 
 * see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
 *
 * @export
 * @param {Response} response the 429 response to calculate the delay for 
 * @returns the number of seconds to wait, or undefined if the Retry-After header is not present
 */
export function parseRateLimitTime(response: Response) {
    const after = response.headers.get("Retry-After")

    if (!after) return

    //try to parse it as an integer
    let secondsToWait = parseInt(after)
    if (isNaN(secondsToWait)) {
        //if number parsing failed, parse as date

        const date = new Date(secondsToWait)

        const now = new Date()
        //round the time down by zeroing milliseconds
        now.setMilliseconds(0)

        secondsToWait = (date.getTime() - now.getTime())/1000
    }
    return secondsToWait
}
