//API actions
export const GET_SCHOOLS_LIST = "FETCH_SCHOOLS_LIST";
export const RECEIVE_SCHOOLS_LIST = "RECEIVE_SCHOOLS_LIST";
export const FETCH_SCHOOLS_ERROR = "SCHOOLS_FETCH_ERROR";

export const GET_SCHOOL = "FETCH_SCHOOL";
export const SCHOOL_RECEIVE = "SCHOOL_RECEIVE";
export const SCHOOL_ERROR = "SCHOOL_ERROR";

// UI actions
export const SELECT_SCHOOL = "SELECT_SCHOOL";
export const INVALIDATE_SCHOOL = "INVALIDATE_SCHOOL";

interface ISelectSchoolAction {
    type: typeof SELECT_SCHOOL;
    id: string;
}

export type SchoolActionTypes = ISelectSchoolAction;
