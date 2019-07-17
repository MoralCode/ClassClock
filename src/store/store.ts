import { combineReducers, applyMiddleware, createStore } from "redux";
import { routerReducer, routerMiddleware } from "redux-first-routing";
import * as reducers from "./reducers";
import thunk from "redux-thunk";

import logger from "redux-logger";

export const configureStore = (hist: any, initialState = {}) => {
    // Add the reducer, which adds location state to the store
    const rootReducer = combineReducers({
        ...reducers,
        router: routerReducer // Convention is to use the "router" property
    });

    // Create the store
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(logger, routerMiddleware(hist), thunk)
    );
};
