import School from "../../@types/school";

//API actions
export const REQUEST_SCHOOLS_LIST = "REQUEST_SCHOOLS_LIST";
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

interface IReceiveSchoolsAction {
    type: typeof RECEIVE_SCHOOLS_LIST;
    schools: School[];
    receivedAt: number;
}

interface ISchoolsErrorAction {
    type: typeof FETCH_SCHOOLS_ERROR;
    message: string;
}

interface IGetSchoolAction {
    type: typeof REQUEST_SCHOOLS_LIST;
}

// interface DeleteMessageAction {
//     type: typeof DELETE_MESSAGE;
//     meta: {
//         timestamp: number;
//     };
// }

export type SchoolActionTypes =
    | ISelectSchoolAction
    | IReceiveSchoolsAction
    | IGetSchoolAction
    | ISchoolsErrorAction;
// | IReceiveSchoolsAction; // | DeleteMessageAction;
