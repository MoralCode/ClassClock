// UI actions
export const SET_TIME_FORMAT = "SET_TIME_FORMAT";

export interface IState {
    userSettings: {
        use24HourTime: boolean;
    };
}

interface ISetTimeFormatAction {
    type: typeof SET_TIME_FORMAT;
    use24HourTime: boolean;
}

// interface IReceiveSchoolAction {
//     type: typeof RECEIVE_SCHOOL;
//     school: School;
//     receivedAt: number;
// }

// interface IRequestSchoolAction {
//     type: typeof REQUEST_SCHOOL;
// }

// interface IFetchErrorAction {
//     type: typeof FETCH_ERROR;
//     message: string;
// }

// // interface DeleteMessageAction {
// //     type: typeof DELETE_MESSAGE;
// //     meta: {
// //         timestamp: number;
// //     };
// // }

export type UserSettingActionTypes = ISetTimeFormatAction;
