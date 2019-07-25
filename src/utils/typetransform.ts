import { createTransform } from "redux-persist";
import { IState } from "../store/schools/types";
import School from "../@types/school";

const SchoolTransform = createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState: IState, key: any) => {
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
            selectedSchool: School.fromState(outboundState.selectedSchool)
        };
    },
    // define which reducers this transform gets called for.
    { whitelist: ["selectedSchoolReducer"] }
);

export default SchoolTransform;
