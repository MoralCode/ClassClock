import * as actions from "./actions";
import * as types from './types';
import configureMockStore from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";
import fetchMock from "fetch-mock";
import { fakeSchoolResponse, fakeBellScheduleListResponse, bellScheduleId, fakeBellScheduleFullResponse, school, schoolId, schoolEndpoint, scheduleListEndpoint, bellScheduleEndpoint } from "../../utils/testconstants";


// import { ISchoolsState } from "./types";
import { AnyAction } from "redux";

type DispatchExts = ThunkDispatch<void, void, AnyAction>;

const middleware = [thunk];
const mockStore = configureMockStore<void, DispatchExts>(middleware);

// const middlewares = [thunk];
// const mockStore = (middlewares);

//see: https://redux.js.org/recipes/writing-tests

describe("school async actions", () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it("creates RECEIVE_SCHOOL when fetching schools has been done", () => {
        fetchMock
            .getOnce(schoolEndpoint, {
                body: fakeSchoolResponse,
                headers: { "Content-Type": "application/vnd.api+json" }
            })
            .getOnce(scheduleListEndpoint, {
                body: fakeBellScheduleListResponse,
                headers: { "Content-Type": "application/vnd.api+json" }
            })
            .getOnce(bellScheduleEndpoint,
                {
                    body: fakeBellScheduleFullResponse,
                    headers: { "Content-Type": "application/vnd.api+json" }
                }
            );

        const expectedActions = [
            { type: types.SELECT_SCHOOL },
            { type: types.RECEIVE_SCHOOL, school, receivedAt: 1234 }
        ];
        const store = mockStore();
        /*{
            selectedSchool: {
                isFetching: false,
                didInvalidate: false,
                data: {}
            }
        }*/

        return store.dispatch(actions.selectSchool("whatever", schoolId)).then(() => {
            // return of async actions
            expect(fetchMock.done()).toBeTruthy();
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});


/*    it("should create an action to select a school", () => {
        const expectedAction = {
            type: types.SELECT_SCHOOL,
        };
        expect(actions.selectSchool()).toEqual(expectedAction);
    });
});





describe("async actions", () => {*/