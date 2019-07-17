import { combineReducers, applyMiddleware, createStore } from "redux";
import { routerReducer, routerMiddleware } from "redux-first-routing";
import * as reducers from "./reducers";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import logger from "redux-logger";

const persistConfig = {
    key: "root",
    storage,
    blacklist: ["router"]
};

export const configureStore = (hist: any, initialState = {}) => {
    // Add the reducer, which adds location state to the store
    const rootReducer = combineReducers({
        ...reducers,
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