import {
    SELECT_SCHOOL,
    SchoolActionTypes,
    FETCH_ERROR,
    RECEIVE_SCHOOL,
    INVALIDATE_SCHOOL,
    SchoolListActionTypes,
    INVALIDATE_SCHOOL_LIST,
    RECEIVE_SCHOOL_LIST,
    REQUEST_SCHOOL_LIST
    // ISchoolsByIdState
} from "./types";
import School from "../../@types/school";

export function selectedSchoolReducer(
    state = {
        isFetching: false,
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

        case INVALIDATE_SCHOOL:
            return Object.assign({}, state, {
                isFetching: false,
                data: {}
            });

        default:
            return state;
    }
}

export function schoolListReducer(
    state = {
        isFetching: false,
        data: []
    },
    action: SchoolListActionTypes
) {
    switch (action.type) {
        case REQUEST_SCHOOL_LIST:
            return Object.assign({}, state, {
                isFetching: true
            });

        case RECEIVE_SCHOOL_LIST:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.schools,
                lastUpdated: action.receivedAt
            });

        case INVALIDATE_SCHOOL_LIST:
            return Object.assign({}, state, {
                isFetching: false,
                data: []
            });

        default:
            return state;
    }
}

export function fetchErrorReducer(state = "", action: SchoolActionTypes) {
    if (action.type === FETCH_ERROR) {
        return action.message;
    } else {
        return state;
    }
}
