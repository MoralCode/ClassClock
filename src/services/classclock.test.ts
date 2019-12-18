import fetchMock from "fetch-mock";
import { fakeSchoolResponse, fakeBellScheduleListResponse, bellScheduleId, fakeBellScheduleFullResponse, school, schoolId, schoolEndpoint, scheduleListEndpoint, bellScheduleEndpoint, schoolListEndpoint, fakeSchoolListResponse } from "../utils/testconstants";
import ClassClockService from "./classclock";

describe("ClassClock API service", () => {
	afterEach(() => {
		fetchMock.restore();
	});

	it("can request the schools list", () => {
		fetchMock
			.getOnce(schoolListEndpoint, {
				body: fakeSchoolListResponse,
				headers: { "Content-Type": "application/vnd.api+json" }
			});
		
		ClassClockService.getSchoolsList("1234");
		expect(fetchMock.done()).toBeTruthy();
	});

	it("can request detailed info for a particular school", () => {
		fetchMock
			.getOnce(schoolEndpoint, {
				body: fakeSchoolResponse,
				headers: { "Content-Type": "application/vnd.api+json" }
			});

		ClassClockService.getSchool("1234", schoolId);
		expect(fetchMock.done()).toBeTruthy();
	});

	it("can request a list of schedules for a particular school", () => {
		fetchMock
			.getOnce(scheduleListEndpoint, {
				body: fakeBellScheduleListResponse,
				headers: { "Content-Type": "application/vnd.api+json" }
			});

		ClassClockService.getSchedulesListForSchool("1234", schoolId);
		expect(fetchMock.done()).toBeTruthy();
	});

	it("can request detailed info for a particular school's schedule", () => {
		fetchMock
			.getOnce(bellScheduleEndpoint, {
				body: fakeBellScheduleFullResponse,
				headers: { "Content-Type": "application/vnd.api+json" }
			});

		ClassClockService.getDetailedScheduleForSchool("1234", schoolId, bellScheduleId);
		expect(fetchMock.done()).toBeTruthy();
	});

	it("can validate responses from the API", async () => {
		fetchMock
			.getOnce(schoolEndpoint, {
				body: fakeSchoolResponse,
				headers: { "Content-Type": "application/vnd.api+json" }
			});

		const validatedResponse = await ClassClockService.validateResponse(ClassClockService.getSchool("1234", schoolId));
		expect(validatedResponse).toEqual(fakeSchoolResponse);
	});

});