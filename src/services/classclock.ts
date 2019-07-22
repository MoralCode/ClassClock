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
    private static getHeaders = (
        authToken: string,
        method: string,
        params?: any
    ): { method: string; headers: Headers } => {
        return Object.assign(
            {},
            {
                method,
                headers: new Headers({
                    Accept: "application/vnd.api+json",
                    Authorization: "Bearer " + authToken
                })
            },
            params
        );
    };
}
