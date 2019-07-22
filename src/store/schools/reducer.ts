import {
    SELECT_SCHOOL,
    SchoolActionTypes,
    FETCH_ERROR,
    RECEIVE_SCHOOL
    // ISchoolsByIdState
} from "./types";
import School from "../../@types/school";

export function selectedSchoolReducer(
    state = {
        isFetching: false,
        didInvalidate: false,
        data: {}
    },
    action: SchoolActionTypes
) {
    switch (action.type) {
        case SELECT_SCHOOL:
            return Object.assign({}, state, {
                isFetching: true
            });

        case RECEIVE_SCHOOL:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.school,
                lastUpdated: action.receivedAt
            });

        // case RECEIVE_SCHEDULES:
        //     return Object.assign({}, state, {
        //         isFetching: false,
        //         data: action.school,
        //         lastUpdated: action.receivedAt
        //     });

        default:
            return state;
    }
}

export function fetchErrorReducer(state = {}, action: SchoolActionTypes) {
    if (action.type === FETCH_ERROR) {
        return action.message;
    } else {
        return state;
    }
}
