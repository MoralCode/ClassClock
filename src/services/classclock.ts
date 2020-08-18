import BellSchedule from "../@types/bellschedule";
import { format } from 'date-fns'
import { objectKeysToSnakeCase } from "../utils/helpers";
export default class ClassClockService {
    public static baseURL: string = "https://api.classclock.app/v0";

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

    static validateResponse = async (
        call: Promise<Response>,
        onError?: (error: Error) => void
    ) => {
        return await call.then(
            (response: Response) => {
                if (response.ok) {
                    return response.json();
                }
            },
            // Do not use catch, because that will also catch
            // any errors in the dispatch and resulting render,
            // causing a loop of 'Unexpected batch number' errors.
            // https://github.com/facebook/react/issues/6895
            (error: Error) => {
                console.log(onError);
                onError ? onError(error) : console.log("An error occurred: ", error);
            }
        );
    };

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

            return value.map((currentValue: Date) => {
                return format(currentValue, 'YYYY-MM-DD');
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

}
