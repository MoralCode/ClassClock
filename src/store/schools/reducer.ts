import {
    SELECT_SCHOOL,
    SchoolActionTypes,
    RECEIVE_SCHOOLS_LIST,
    FETCH_ERROR
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
    switch (action.type) {
        case RECEIVE_SCHOOLS_LIST:
            const schoolsById: { [k: string]: any } = {};

            const schoolTemplate = {
                isFetching: false,
                didInvalidate: false,
                data: {}
            };

            for (const school of action.schools) {
                // console.log(school);
                schoolsById[school.getIdentifier()] = Object.assign({}, schoolTemplate, {
                    data: school,
                    lastUpdated: action.receivedAt
                });
            }

            return schoolsById;

        /*
            <id>: {
                details
            }

            */
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
