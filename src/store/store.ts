import { combineReducers, applyMiddleware, createStore } from "redux";
import { routerReducer, routerMiddleware, createBrowserHistory } from "redux-first-routing";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import logger from "redux-logger";

import { selectedSchoolReducer, fetchErrorReducer, schoolListReducer } from "./schools/reducer";
import SchoolTransform from "../utils/typetransform";
import { userSettingsReducer } from "./usersettings/reducer";
import ClassClockService from "../services/classclock";


// Create the history object
export const history = createBrowserHistory();

//connect the data provider to the REST endpoint

const persistConfig = {
    key: "root",
    storage,
    transforms: [SchoolTransform],
    blacklist: ["router", "error"]
};

export const configureStore = (hist: any, initialState = {}) => {
    // Add the reducer, which adds location state to the store
    const rootReducer = combineReducers({
        selectedSchool: persistReducer({
            key: "selectedSchool",
            storage,
            blacklist: ["isFetching"]
        }, selectedSchoolReducer),
        schoolList: persistReducer({
            key: "schoolList",
            storage,
            blacklist: ["isFetching"]
        },schoolListReducer),
        userSettings: userSettingsReducer,
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


// Create the store, passing it the history object
export const configuredStore = configureStore(history); //createStore(combineReducers(reducers), applyMiddleware(thunk));
