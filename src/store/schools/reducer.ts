import { SELECT_SCHOOL, SchoolActionTypes } from "./types";

export function selectedSchoolReducer(state = "", action: SchoolActionTypes): string {
    switch (action.type) {
        case SELECT_SCHOOL:
            return action.id;
        default:
            return state;
    }
}
