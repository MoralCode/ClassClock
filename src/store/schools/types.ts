import School from "../../@types/school";

//API actions
export const REQUEST_SCHOOLS_LIST = "REQUEST_SCHOOLS_LIST";
export const RECEIVE_SCHOOLS_LIST = "RECEIVE_SCHOOLS_LIST";

export const REQUEST_SCHOOL = "FETCH_SCHOOL";
export const RECEIVE_SCHOOL = "RECEIVE_SCHOOL";

export const FETCH_ERROR = "FETCH_ERROR";

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

interface IRequestSchoolsAction {
    type: typeof REQUEST_SCHOOLS_LIST;
}

interface IFetchErrorAction {
    type: typeof FETCH_ERROR;
    message: string;
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
    | IRequestSchoolsAction
    | IFetchErrorAction;
// | IReceiveSchoolsAction; // | DeleteMessageAction;
