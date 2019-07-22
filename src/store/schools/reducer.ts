import {
    SELECT_SCHOOL,
    SchoolActionTypes,
    RECEIVE_SCHOOLS_LIST,
    FETCH_ERROR,
    RECEIVE_SCHOOL
    // ISchoolsByIdState
} from "./types";
import School from "../../@types/school";

export function selectedSchoolReducer(state = "", action: SchoolActionTypes): string {
    switch (action.type) {
        case SELECT_SCHOOL:
            return action.id;
        default:
            return state;
    }
}

// default values
export function schoolsByIdReducer(state = {}, action: SchoolActionTypes) {
    const schoolTemplate = {
        isFetching: false,
        didInvalidate: false,
        data: {}
    };

    switch (action.type) {
        case RECEIVE_SCHOOLS_LIST:
            const schoolsById: { [k: string]: any } = {};

            for (const school of action.schools) {
                // console.log(school);
                schoolsById[school.getIdentifier()] = Object.assign({}, schoolTemplate, {
                    data: school,
                    lastUpdated: action.receivedAt
                });
            }

            return schoolsById;
        case RECEIVE_SCHOOL:
            const schoolContent = Object.assign({}, schoolTemplate, {
                data: action.school,
                lastUpdated: action.receivedAt
            });
            return Object.assign({}, state, {
                [action.school.getIdentifier()]: schoolContent
            });

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
