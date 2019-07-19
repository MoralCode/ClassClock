import { SELECT_SCHOOL, SchoolActionTypes } from "./types";

export function selectSchool(schoolId: string): SchoolActionTypes {
    return {
        type: SELECT_SCHOOL,
        id: schoolId
    };
}
