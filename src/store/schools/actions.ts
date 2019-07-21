import {
    SELECT_SCHOOL,
    RECEIVE_SCHOOLS_LIST,
    SchoolActionTypes,
    REQUEST_SCHOOLS_LIST,
    FETCH_SCHOOLS_ERROR
} from "./types";
import { Dispatch } from "redux";
import { API } from "../../utils/constants";
import School from "../../@types/school";

export function selectSchool(schoolId: string): SchoolActionTypes {
    return {
        type: SELECT_SCHOOL,
        id: schoolId
    };
}

function receiveSchoolsList(json: object[]): SchoolActionTypes {
    return {
        type: RECEIVE_SCHOOLS_LIST,
        schools: json.map(
            (child: any) =>
                new School(child.id, child.attributes.full_name, child.attributes.acronym)
        ),
        receivedAt: Date.now()
    };
}

function requestSchoolsList(): SchoolActionTypes {
    return {
        type: REQUEST_SCHOOLS_LIST
    };
}

function schoolsListError(message: string): SchoolActionTypes {
    return {
        type: FETCH_SCHOOLS_ERROR,
        message: message
    };
}

// Async action creators
export function fetchSchoolsList(authToken: string) {
    // Thunk middleware knows how to handle functions.
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.

    return async (dispatch: Dispatch) => {
        // First dispatch: the app state is updated to inform
        // that the API call is starting.

        dispatch(requestSchoolsList());

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.

        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.

        const fetchData = {
            method: "GET",
            // body: data,
            headers: new Headers({
                Accept: "application/vnd.api+json",
                Authorization: "Bearer " + authToken //getTokenSilently()
            })
        };
        // console.log(getTokenSilently());
        return await fetch(API.baseURL + "/schools/", fetchData)
            .then(
                response => {
                    // console.log("ALKJ:LFKK EWF:LK J:LK");
                    console.log(response.body);
                    if (response.ok) {
                        return response.json();
                    }
                },
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => dispatch(schoolsListError(error.message)) //console.log("An error occurred.", error)
            )
            .then(json => {
                // console.log("akflds");
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.

                console.log(json.data[0]);

                dispatch(receiveSchoolsList(json.data));

                const schoolsList = json.data;
                if (schoolsList.length === 1) {
                    dispatch(selectSchool(schoolsList[0].id));
                }
            });
    };
}
