import {
    SELECT_SCHOOL,
    SchoolActionTypes,
    FETCH_ERROR,
    RECEIVE_SCHOOL,
    REQUEST_SCHOOL
} from "./types";
import { Dispatch } from "redux";
import { API } from "../../utils/constants";
import School from "../../@types/school";

function requestSchool(): SchoolActionTypes {
    return {
        type: SELECT_SCHOOL
    };
}

function receiveSchool(json: any): SchoolActionTypes {
    return {
        type: RECEIVE_SCHOOL,
        school: new School(
            json.id,
            json.attributes.full_name,
            json.attributes.acronym,
            undefined,
            undefined,
            json.attributes.alternate_freeperiod_name,
            json.links.self,
            json.attributes.creation_date,
            json.attributes.last_modified
        ),
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

        const fetchData = {
            method: "GET",
            // body: data,
            headers: new Headers({
                Accept: "application/vnd.api+json",
                Authorization: "Bearer " + authToken
            })
        };
        return await fetch(API.baseURL + "/school/" + schoolId + "/", fetchData)
            .then(
                response => {
                    if (response.ok) {
                        return response.json();
                    }
                },
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => dispatch(fetchError(error.message)) //console.log("An error occurred.", error)
            )
            .then(json => dispatch(receiveSchool(json.data)));
    };
}
