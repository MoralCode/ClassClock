export default class ClassClockService {
    public baseURL: string = "http://localhost:5000/v0";

    getSchoolsList = async (authToken: string): Promise<Response> => {
        return await fetch(this.baseURL + "/schools/", this.getHeaders(authToken, "GET"));
    };

    getSchool = async (authToken: string, schoolId: string): Promise<Response> => {
        return await fetch(
            this.baseURL + "/school/" + schoolId + "/",
            this.getHeaders(authToken, "GET")
        );
    };
    private getHeaders = (
        authToken: string,
        method: string
    ): { method: string; headers: Headers } => {
        return {
            method,
            headers: new Headers({
                Accept: "application/vnd.api+json",
                Authorization: "Bearer " + authToken
            })
        };
    };
}
