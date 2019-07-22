import {
    SELECT_SCHOOL,
    SchoolActionTypes,
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

export function fetchErrorReducer(state = {}, action: SchoolActionTypes) {
    if (action.type === FETCH_ERROR) {
        return action.message;
    } else {
        return state;
    }
}
