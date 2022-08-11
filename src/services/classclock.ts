import BellSchedule from "../@types/bellschedule";
import { format } from 'date-fns'
import { delay, objectKeysToSnakeCase, parseRateLimitTime, promiseRetry } from "../utils/helpers";
import { DateTime } from "luxon";
import { RateLimitError } from "../utils/errors";

export default class ClassClockService {
    public static baseURL: string = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "http://localhost:8000/v0" : "https://api.classclock.app/v0";

    static getSchoolsList = async (params?: any): Promise<Response> => {
        return await fetch(
            ClassClockService.baseURL + "/schools/",
            ClassClockService.getHeaders("GET", params)
        );
    };

    static getSchool = async (schoolId: string, params?: any): Promise<Response> => {
        return await fetch(
            ClassClockService.baseURL + "/school/" + schoolId + "/",
            ClassClockService.getHeaders("GET", params)
        );
    };

    static getSchedulesListForSchool = async (
        schoolId: string,
        params?: any
    ): Promise<Response> => {
        return await fetch(
            ClassClockService.baseURL + "/bellschedules/" + schoolId + "/",
            ClassClockService.getHeaders("GET", params)
        );
    };

    /**
     * Validates responses to ClassClock Service API calls and applies things like request retrying, some error handling, and converting the response body to a usable format
     * 
     * in future it may be useful to move this to a more generic helper function (makeAPICall?) and use generic <T> types to indicate which class's static methods to reference
     *
     * @static
     * @memberof ClassClockService
     */
    static validateResponse = async (
        call: Promise<Response>,
        onError?: (error: Error) => void
    ): Promise<Response> => {

        const promise = call.then((response: Response) => {
            if (response.ok) {
                return ClassClockService.handleBodyConversion(response)
            }
            //response was successful, but received a less-than-desirable response code
            else if (response.status == 429) { //rate-limited
                const secondsToWait = parseRateLimitTime(response) || 1
                throw new RateLimitError("A rate limit was reached", secondsToWait * 1000)
            }
        });
        return promiseRetry(promise).catch(error => {
            onError ? onError(error.message) : console.error(error);
            throw error
        });
    };

    //this is mostly here to make the response handling more generic
    private static handleBodyConversion = (response: Response) => response.json()

    static updateBellSchedule = async (
        schedule: BellSchedule,
        authToken: string
    ) => {
        return await fetch(
            ClassClockService.baseURL +
            "/bellschedule/" +
            schedule.getIdentifier() +
            "/",
            ClassClockService.getHeaders("PATCH", authToken, {
                body: JSON.stringify(schedule, ClassClockService.jsonifyReplacer)
            })
        );
        // return await response.json(); // parses JSON response into native JavaScript objects

    }

    static makeAPICall = (method: string, url: string, authToken?: string, params?: object ) => {
        return fetch(url, ClassClockService.getHeaders(method, authToken, params))
    }

    //sets up request headers for outgoing API calls
    private static getHeaders = (
        method: string,
        authToken?: string,
        params?: object
    ): { method: string; headers: Headers } => {

        let headers = new Headers({
            Accept: "application/json",
            "Content-Type": "application/json"
        })

        if (authToken) {
            headers.append("Authorization", "Bearer " + authToken)
        }

        return Object.assign(
            {},
            {
                method,
                headers: headers
            },
            params
        );
    };

    // prepares an object for being sent to the ClassClock API
    private static jsonifyReplacer(key: string, value: any) {
        console.log(key, value)
        if (key == 'date') {
            return format(value, 'YYYY-MM-DD');
            // Date-fns v2
            // return format(value, 'yyyy-MM-dd');
        } else if (key == 'dates') {

            return value.map((currentValue: DateTime) => {
                return currentValue.toFormat('YYYY-MM-DD');
                // Date-fns v2
                // return format(value, 'yyyy-MM-dd');
            })
        } else if (Object.prototype.toString.call(value) === '[object Array]') {

            var copyArray: any[] = [];

            for (const element in copyArray) {
                if (typeof element === 'object') {
                    copyArray.push(objectKeysToSnakeCase(element));
                } else {
                    copyArray.push(element);
                }
            }
        
            return copyArray;
        } else if (typeof value === 'object') {
           return objectKeysToSnakeCase(value);
        } 
        return value;
    }


    /**
     * performs a HEAD request to the baseURL to confirm that the domain is reachable
     * 
     * based on https://stackoverflow.com/a/44766737
     * @static
     * @returns true if the service is reachable, false otherwise
     * @memberof ClassClockService
     */
    public static async isReachable() {
        // TODO: handle request redirects across this whole file
        const headers = ClassClockService.getHeaders("HEAD", undefined, {mode: 'no-cors'})
        return await fetch(ClassClockService.baseURL + "/ping/", headers).then((resp) => {
            return resp && (resp.ok || resp.type === 'opaque');
        }).catch((err) => {
            console.warn('[conn test failure]:', err);
            return false
        });
    }
}
