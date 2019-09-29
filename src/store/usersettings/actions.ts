import { UserSettingActionTypes, SET_TIME_FORMAT } from "./types";

export function setTimeFormatPreference(use24HourTime: boolean): UserSettingActionTypes {
    return {
        type: SET_TIME_FORMAT,
        use24HourTime
    };
}
