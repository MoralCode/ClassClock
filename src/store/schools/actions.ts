import {
    SELECT_SCHOOL,
    SchoolActionTypes,
    FETCH_ERROR,
    RECEIVE_SCHOOL,
    REQUEST_SCHOOL
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

function receiveSchool(json: any): SchoolActionTypes {
    return {
        type: RECEIVE_SCHOOL,
        school: School.fromJson(deconstructJsonApiResource(json)),
        receivedAt: Date.now()
    };
}

function fetchError(message: string): SchoolActionTypes {
    return {
        type: FETCH_ERROR,
        message
    };
}

export function selectSchool(authToken: string, schoolId: string) {
    return async (dispatch: Dispatch) => {
        dispatch(requestSchool());

        const school = ClassClockService.validateResponse(
            ClassClockService.getSchool(authToken, schoolId)
        );

        const schedules = ClassClockService.validateResponse(
            ClassClockService.getSchedulesListForSchool(authToken, schoolId)
        );

        Promise.all([school, schedules]).then((result: any) => {
            const [schoolResult, scheduleResult] = result;

            //result = [school() result, schedules() result]
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#Using_Promise.all

            const scheduleDataList: Array<Promise<any>> = [];

            for (const schedule of scheduleResult.data) {
                const scheduleId = schedule.id;
                // const sched_uri = schedule.links.self;
                const scheduleRequest = ClassClockService.validateResponse(
                    ClassClockService.getDetailedScheduleForSchool(
                        authToken,
                        schoolId,
                        scheduleId
                    )
                );

                scheduleDataList.push(scheduleRequest);
            }

            Promise.all(scheduleDataList).then((schedulesList: any) => {
                schoolResult.data.attributes.schedules = schedulesList.map(
                    (schedule: any) => schedule.data
                );
                console.log("schoolResult: ", schoolResult.data);
                dispatch(receiveSchool(schoolResult.data));
            });
        });
    };
}
