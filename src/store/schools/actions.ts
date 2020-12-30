import {
    SELECT_SCHOOL,
    SchoolActionTypes,
    FETCH_ERROR,
    RECEIVE_SCHOOL,
    REQUEST_SCHOOL,
    INVALIDATE_SCHOOL,
    REQUEST_SCHOOL_LIST,
    SchoolListActionTypes,
    INVALIDATE_SCHOOL_LIST,
    RECEIVE_SCHOOL_LIST
} from "./types";
import { Dispatch } from "redux";
import ClassClockService from "../../services/classclock";
import School from "../../@types/school";
import BellSchedule from "../../@types/bellschedule";
import { DateTime } from "luxon";

function requestSchool(): SchoolActionTypes {
    return {
        type: SELECT_SCHOOL
    };
}

export function invalidateSchool(): SchoolActionTypes {
    return {
        type: INVALIDATE_SCHOOL
    };
}

function receiveSchool(json: any): SchoolActionTypes {
    return {
        type: RECEIVE_SCHOOL,
        school: School.fromJson(json),
        receivedAt: DateTime.local().toMillis()
    };
}

function fetchError(message: string): SchoolActionTypes {
    return {
        type: FETCH_ERROR,
        message
    };
}

export function selectSchool(schoolId: string) {
    return async (dispatch: Dispatch) => {
        dispatch(requestSchool());

        const onError = (error: Error) => {
            console.log("Caught an error: ", error.message);
            dispatch(fetchError(error.message));
        };

        const school = ClassClockService.validateResponse(
            ClassClockService.getSchool(schoolId),
            onError
        );

        const schedules = ClassClockService.validateResponse(
            ClassClockService.getSchedulesListForSchool(schoolId),
            onError
        );

        Promise.all([school, schedules]).then(
            (result: any) => {
                const [schoolResult, scheduleResult] = result;

                //result = [school() result, schedules() result]
                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#Using_Promise.all

                schoolResult.data.schedules = scheduleResult.data;
                dispatch(
                    receiveSchool(schoolResult.data)
                );      
            },
            (error: Error) => onError(error)
        );
    };
}

function requestSchoolList(): SchoolListActionTypes {
    return {
        type: REQUEST_SCHOOL_LIST
    };
}

export function invalidateSchoolList(): SchoolListActionTypes {
    return {
        type: INVALIDATE_SCHOOL_LIST
    };
}

function receiveSchoolList(json: any): SchoolListActionTypes {
    return {
        type: RECEIVE_SCHOOL_LIST,
        schools: json.map((sch: string) => School.fromJson(sch)),
        receivedAt: DateTime.local().toMillis()
    };
}

//TODO: Reduce duplication somehow
export function getSchoolsList(abortSignal?: AbortSignal) {
    return async (dispatch: Dispatch) => {
        dispatch(requestSchoolList());

        const onError = (error: Error) => {
            console.log("Caught an error: ", error.message);
            if (error.message) dispatch(fetchError(error.message));
        };

        const schoolList = ClassClockService.validateResponse(
            ClassClockService.getSchoolsList(
                abortSignal ? {signal: abortSignal}: undefined
                ),
            onError
        );

        schoolList.then(
            (result: any) => {
                dispatch(
                    receiveSchoolList(result.data)
                );
            },
            (error: Error) => onError(error)
        );
    };
}