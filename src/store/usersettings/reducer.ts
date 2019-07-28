import { UserSettingActionTypes, SET_TIME_FORMAT } from "./types";

export function userSettingsReducer(
    state = {
        use24HourTime: false
    },
    action: UserSettingActionTypes
) {
    switch (action.type) {
        case SET_TIME_FORMAT:
            return Object.assign({}, state, {
                use24HourTime: action.use24HourTime
            });
        default:
            return state;
    }
}
