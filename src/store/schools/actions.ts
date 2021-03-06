import {
    SELECT_SCHOOL,
    SchoolActionTypes,
    FETCH_ERROR,
    RECEIVE_SCHOOL,
    REQUEST_SCHOOL,
    INVALIDATE_SCHOOL
} from "./types";
import { Dispatch } from "redux";
import ClassClockService from "../../services/classclock";
import School from "../../@types/school";
import BellSchedule from "../../@types/bellschedule";
import { deconstructJsonApiResource } from "../../utils/helpers";

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
        receivedAt: Date.now()
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

                const scheduleDataList: Array<Promise<any>> = [];

                for (const schedule of scheduleResult.data) {
                    const scheduleId = schedule.id;
                    // const sched_uri = schedule.links.self;
                    const scheduleRequest = ClassClockService.validateResponse(
                        ClassClockService.getDetailedScheduleForSchool(
                            schoolId,
                            scheduleId
                        ),
                        onError
                    );

                    scheduleDataList.push(scheduleRequest);
                }

                Promise.all(scheduleDataList).then(
                    (schedulesList: any) => {
                        schoolResult.data.attributes.schedules = schedulesList.map(
                            (schedule: any) => deconstructJsonApiResource(schedule.data)
                        );
                        dispatch(
                            receiveSchool(deconstructJsonApiResource(schoolResult.data))
                        );
                    },
                    (error: Error) => onError(error)
                );
            },
            (error: Error) => onError(error)
        );
    };
}
