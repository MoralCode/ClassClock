import fetchMock from "fetch-mock";
import { fakeSchoolResponse, fakeBellScheduleListResponse, schoolId, schoolEndpoint, bellScheduleEndpoint, schoolListEndpoint, fakeSchoolListResponse } from "../utils/testconstants";
import ClassClockService from "./classclock";

const headers = { "Content-Type": "application/json" }

describe("ClassClock API service", () => {
	afterEach(() => {
		fetchMock.restore();
	});

	it("can request the schools list", () => {
		fetchMock
			.getOnce(schoolListEndpoint, {
				body: fakeSchoolListResponse,
				headers
			});
		
		ClassClockService.getSchoolsList("1234");
		expect(fetchMock.done()).toBeTruthy();
	});

	it("can request detailed info for a particular school", () => {
		fetchMock
			.getOnce(schoolEndpoint, {
				body: fakeSchoolResponse,
				headers
			});

		ClassClockService.getSchool(schoolId);
		expect(fetchMock.done()).toBeTruthy();
	});

	it("can request a list of schedules for a particular school", () => {
		fetchMock
			.getOnce(bellScheduleEndpoint, {
				body: fakeBellScheduleListResponse,
				headers
			});

		ClassClockService.getSchedulesListForSchool(schoolId);
		expect(fetchMock.done()).toBeTruthy();
	});

	it("can validate responses from the API", async () => {
		fetchMock
			.getOnce(schoolEndpoint, {
				body: fakeSchoolResponse,
				headers
			});

		const validatedResponse = await ClassClockService.validateResponse(ClassClockService.getSchool(schoolId));
		expect(validatedResponse).toEqual(fakeSchoolResponse);
	});

});