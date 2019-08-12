export default class ClassClockService {
    public static baseURL: string = "http://localhost:5000/v0";

    static getSchoolsList = async (
        authToken: string,
        params?: any
    ): Promise<Response> => {
        return await fetch(
            ClassClockService.baseURL + "/schools/",
            ClassClockService.getHeaders(authToken, "GET", params)
        );
    };

    static getSchool = async (
        authToken: string,
        schoolId: string,
        params?: any
    ): Promise<Response> => {
        return await fetch(
            ClassClockService.baseURL + "/school/" + schoolId + "/",
            ClassClockService.getHeaders(authToken, "GET", params)
        );
    };

    static getSchedulesListForSchool = async (
        authToken: string,
        schoolId: string,
        params?: any
    ): Promise<Response> => {
        return await fetch(
            ClassClockService.baseURL + "/school/" + schoolId + "/bellschedules/",
            ClassClockService.getHeaders(authToken, "GET", params)
        );
    };

    static getDetailedScheduleForSchool = async (
        authToken: string,
        schoolId: string,
        scheduleId: string,
        params?: any
    ): Promise<Response> => {
        return await fetch(
            ClassClockService.baseURL +
                "/school/" +
                schoolId +
                "/bellschedule/" +
                scheduleId +
                "/",
            ClassClockService.getHeaders(authToken, "GET", params)
        );
    };

    static validateResponse = async (call: Promise<Response>) => {
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
            (error: Error) => console.log("An error occurred.", error)
        );
    };

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
                headers: new Headers({
                    Accept: "application/vnd.api+json"
                })
            },
            parameters
        );
    };
}
