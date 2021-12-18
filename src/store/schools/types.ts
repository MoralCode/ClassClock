import School from "../../@types/school";

//API actions
export const REQUEST_SCHOOL = "FETCH_SCHOOL";
export const REQUEST_SCHOOL_LIST = "FETCH_SCHOOL_LIST";
export const RECEIVE_SCHOOL = "RECEIVE_SCHOOL";
export const RECEIVE_SCHOOL_LIST = "RECEIVE_SCHOOL_LIST";

export const FETCH_ERROR = "FETCH_ERROR";

// UI actions
export const SELECT_SCHOOL = "SELECT_SCHOOL";
export const LIST_SCHOOLS = "LIST_SCHOOLS";
export const INVALIDATE_SCHOOL = "INVALIDATE_SCHOOL";
export const INVALIDATE_SCHOOL_LIST = "INVALIDATE_SCHOOL_LIST";

export interface ISchoolsState {
    selectedSchool: SelectedSchoolState;
}

export type SelectedSchoolState =  SelectedSchoolData & SchoolMeta

export interface SelectedSchoolData {
    data: School;
}

export interface SchoolMeta {
    isFetching: boolean;
    didInvalidate: false;
    lastUpdated: number
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


export interface ISchoolListState {
    schoolList: SchoolListState;
}

export type SchoolListState = SchoolListData & SchoolMeta

export interface SchoolListData {
    data: School[];
}

interface IListSchoolsAction {
    type: typeof LIST_SCHOOLS;
}

interface IReceiveSchoolListAction {
    type: typeof RECEIVE_SCHOOL_LIST;
    schools: School[];
    receivedAt: number;
}

interface IRequestSchoolListAction {
    type: typeof REQUEST_SCHOOL_LIST;
}

interface IInvalidateSchoolListAction {
    type: typeof INVALIDATE_SCHOOL_LIST;
}

export type SchoolListActionTypes =
    | IListSchoolsAction
    | IReceiveSchoolListAction
    | IRequestSchoolListAction
    | IInvalidateSchoolListAction;
