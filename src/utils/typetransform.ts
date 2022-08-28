import { createTransform } from "redux-persist";
import { ISchoolsState } from "../store/schools/types";
import School from "../@types/school";

const SchoolTransform = createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState: ISchoolsState, key: any) => {
        // convert mySet to an Array.
        return {
            ...inboundState,
            selectedSchool: JSON.stringify(inboundState.selectedSchool)
        };
    },
    // transform state being rehydrated
    (outboundState: any, key: any) => {
        // convert mySet back to a Set.
        return {
            ...outboundState,
            selectedSchool: School.fromJson(outboundState.selectedSchool)
        };
    },
    // define which reducers this transform gets called for.
    { whitelist: ["selectedSchool"] }
);

export default SchoolTransform;
