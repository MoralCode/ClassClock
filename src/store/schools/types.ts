import School from "../../@types/school";

//API actions
export const REQUEST_SCHOOL = "FETCH_SCHOOL";
export const RECEIVE_SCHOOL = "RECEIVE_SCHOOL";

export const FETCH_ERROR = "FETCH_ERROR";

// UI actions
export const SELECT_SCHOOL = "SELECT_SCHOOL";
export const INVALIDATE_SCHOOL = "INVALIDATE_SCHOOL";

export interface IState {
    selectedSchool: {
        isFetching: boolean;
        didInvalidate: false;
        data: School;
    };
}

interface ISelectSchoolAction {
    type: typeof SELECT_SCHOOL;
}

interface IReceiveSchoolAction {
    type: typeof RECEIVE_SCHOOL;
    school: School;
    receivedAt: number;
}

interface IRequestSchoolAction {
    type: typeof REQUEST_SCHOOL;
}

interface IInvalidateSchoolAction {
    type: typeof INVALIDATE_SCHOOL;
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
    | IReceiveSchoolAction
    | IRequestSchoolAction
    | IInvalidateSchoolAction
    | IFetchErrorAction;
// | IReceiveSchoolsAction; // | DeleteMessageAction;
