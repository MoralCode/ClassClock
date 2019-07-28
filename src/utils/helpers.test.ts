import React from "react";
import ReactDOM from "react-dom";
import {
    getValueIfKeyInList,
    deconstructJsonApiResource,
    sortClassesByStartTime
} from "./helpers";
import ClassPeriod from "../@types/classperiod";
import Time from "../@types/time";

test("get value if key in list", () => {
    const object1 = { value1: "foo" };
    const object2 = { value_1: "foo" };
    const list = ["value_1", "value1"];

    expect(getValueIfKeyInList(list, object1)).toBe("foo");
    expect(getValueIfKeyInList(list, object2)).toBe("foo");
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
    const currentDate = new Date();

    const classes = [
        new ClassPeriod("lunch", new Time(9, 10), new Time(10, 25), currentDate),
        new ClassPeriod("second", new Time(10, 30), new Time(12, 0), currentDate),
        new ClassPeriod("first", new Time(8, 25), new Time(9, 5), currentDate)
    ];

    const sortedClasses = [
        new ClassPeriod("first", new Time(8, 25), new Time(9, 5), currentDate),
        new ClassPeriod("lunch", new Time(9, 10), new Time(10, 25), currentDate),
        new ClassPeriod("second", new Time(10, 30), new Time(12, 0), currentDate)
    ];

    expect(sortClassesByStartTime(classes)).toEqual(sortedClasses);
});
