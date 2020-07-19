import BellSchedule from "../@types/bellschedule";

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
                body: JSON.stringify(schedule)
            })
        );
        // return await response.json(); // parses JSON response into native JavaScript objects

    }

    private static getHeaders = (
        method: string,
        authToken?: string,
        params?: any
    ): { method: string; headers: Headers } => {
        const parameters = authToken
            ? { ...params, Authorization: "Bearer " + authToken }
            : params;
        return Object.assign(
            {},
            {
                method,
                headers: new Headers({ Accept: "application/json" })
            },
            parameters
        );
    };
}
