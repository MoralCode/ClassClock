import {
    SELECT_SCHOOL,
    SchoolActionTypes,
    FETCH_ERROR,
    RECEIVE_SCHOOL,
    REQUEST_SCHOOL
} from "./types";
import { Dispatch } from "redux";
import ClassClockService from "../../services/classclock";
import School from "../../@types/school";

function requestSchool(): SchoolActionTypes {
    return {
        type: SELECT_SCHOOL
    };
}

function receiveSchool(json: any): SchoolActionTypes {
    return {
        type: RECEIVE_SCHOOL,
        school: School.fromJsonApi(json),
        receivedAt: Date.now()
    };
}

function fetchError(message: string): SchoolActionTypes {
    return {
        type: FETCH_ERROR,
        message
    };
}

export function selectSchool(authToken: string, schoolId: string) {
    return async (dispatch: Dispatch) => {
        dispatch(requestSchool());

        return await ClassClockService.getSchool(authToken, schoolId)
            .then(
                (response: Response) => {
                    if (response.ok) {
                        return response.json();
                    }
                },
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                (error: Error) => dispatch(fetchError(error.message)) //console.log("An error occurred.", error)
            )
            .then((json: any) => dispatch(receiveSchool(json.data)));
    };
}
