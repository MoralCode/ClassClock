
import {
    getValueIfKeyInList,
    deconstructJsonApiResource,
    sortClassesByStartTime,
    getTimeStateForDateAtSchool
} from "./helpers";
import ClassPeriod from "../@types/classperiod";
import Time from "../@types/time";
import { classPeriod2, classPeriod, beforeSchoolHours, school, betweenClass, inClass, noSchool, afterSchoolHours, bellScheduleClasses } from "./testconstants";
import { TimeStates } from "./enums";

test("get value if key in list", () => {
    const object1 = { value1: "foo" };
    const object2 = { value_1: "foo" };
    const list = ["value_1", "value1"];

    expect(getValueIfKeyInList(list, object1)).toBe("foo");
    expect(getValueIfKeyInList(list, object2)).toBe("foo");
    expect(getValueIfKeyInList(["doesNotExist"], object1)).toBeFalsy();
});

test("deconstruct JSON:API responses", () => {
    const jsonapi_resource_object = {
        type: "sample",
        id: "1",
        attributes: {
            prop1: "foo",
            prop2: "bar",
            prop3: "baz"
        },
        links: {
            self: "/the/path/to/the/thing"
        }
    };

    const flattened_response = {
        type: "sample",
        id: "1",
        prop1: "foo",
        prop2: "bar",
        prop3: "baz",
        endpoint: "/the/path/to/the/thing"
    };

    expect(deconstructJsonApiResource(jsonapi_resource_object)).toEqual(
        flattened_response
    );
});

//ignoring getCurrentDate

test("sort classes by start time", () => {
    expect(sortClassesByStartTime(bellScheduleClasses.reverse())).toEqual(bellScheduleClasses);
});


test("get time states for given date and school", () => {
    expect(getTimeStateForDateAtSchool(beforeSchoolHours, school)).toBe(
        TimeStates.OUTSIDE_SCHOOL_HOURS
    );

    expect(getTimeStateForDateAtSchool(noSchool, school)).toBe(
        TimeStates.DAY_OFF
    );

    expect(getTimeStateForDateAtSchool(betweenClass, school)).toBe(
        TimeStates.SCHOOL_IN_CLASS_OUT
    );

    expect(getTimeStateForDateAtSchool(inClass, school)).toBe(
        TimeStates.CLASS_IN_SESSION
    );

    expect(getTimeStateForDateAtSchool(afterSchoolHours, school)).toBe(
        TimeStates.OUTSIDE_SCHOOL_HOURS
    );
    
})
