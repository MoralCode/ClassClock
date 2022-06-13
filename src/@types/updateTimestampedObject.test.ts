import { DateTime } from "luxon";
import { schoolTimezone } from "../utils/testconstants";
import UpdateTimestampedObject from "./updateTimestampedObject";

let lastUpdated = DateTime.fromISO("2019-07-28T07:37:50.634Z")
let sut = new UpdateTimestampedObject(lastUpdated)


describe("UpdateTimestampedObect", () => {

    it("can return date last updated", () => {
        expect(sut.lastUpdated()).toEqual(lastUpdated);
    });

    it("can Test if it has changed since a given date", () => {
        //school was last updated on currentDate
        expect(sut.hasChangedSince(lastUpdated.minus({ hours: 1 }))).toBe(true);
        expect(sut.hasChangedSince(lastUpdated.plus({ hours: 1 }))).toBe(false);

        expect(sut.hasChangedSince(DateTime.fromISO("2019-07-28T00:07:50.634", { zone: schoolTimezone }))).toBe(true);
        expect(sut.hasChangedSince(DateTime.fromISO("2019-07-28T08:07:50.635", { zone: schoolTimezone }))).toBe(false);
    });
});
