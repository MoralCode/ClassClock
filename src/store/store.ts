import { combineReducers, applyMiddleware, createStore } from "redux";
import { routerReducer, routerMiddleware } from "redux-first-routing";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import logger from "redux-logger";

import { selectedSchoolReducer, fetchErrorReducer } from "./schools/reducer";
import SchoolTransform from "../utils/typetransform";

const persistConfig = {
    key: "root",
    storage,
    transforms: [SchoolTransform],
    blacklist: ["router", "error"]
};

export const configureStore = (hist: any, initialState = {}) => {
    // Add the reducer, which adds location state to the store
    const rootReducer = combineReducers({
        selectedSchool: selectedSchoolReducer,
        error: fetchErrorReducer,
        router: routerReducer // Convention is to use the "router" property
    });

    const persistedReducer = persistReducer(persistConfig, rootReducer);
    // Create the store
    const store = createStore(
        persistedReducer,
        initialState,
        applyMiddleware(logger, routerMiddleware(hist), thunk)
    );

    const persistor = persistStore(store);
    return { store, persistor };
};
