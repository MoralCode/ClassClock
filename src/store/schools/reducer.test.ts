import { selectedSchoolReducer } from "./reducer";
import * as types from "./types";
import { schoolJSON, school } from "../../utils/testconstants";

describe("school reducer", () => {

    it("should return the initial state", () => {
        expect(selectedSchoolReducer(undefined, {
            type: "FETCH_ERROR", // this activates the default case in the selectedSchoolReducer... maybe not the best way to test it...
            message: ""
        })).toEqual({
            isFetching: false,
            data: {}
        });
    });

    it("should handle SELECT_SCHOOL", () => {
        expect(
            selectedSchoolReducer(undefined, {
                type: types.SELECT_SCHOOL
            })
        ).toEqual({
            isFetching: true,
            data: {}
        });
    });


    it("should handle RECEIVE_SCHOOL", () => {
        expect(
            selectedSchoolReducer(undefined, {
                type: types.RECEIVE_SCHOOL,
                school,
                receivedAt: 1234
            })
        ).toEqual({
            isFetching: false,
            data: school,
            lastUpdated: 1234
        });
    });
});
