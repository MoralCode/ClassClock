import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { configureStore } from "./store/store";
import { createBrowserHistory, startListener, push, replace } from "redux-first-routing";
import UniversalRouter from "universal-router";
import App from "./pages/App";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const routes = [
    {
        path: "/",
        action: () => <App />
    },
    {
        path: "/schedule.html",
        action: () => <Schedule />
    },
    {
        path: "/settings.html",
        action: () => <Settings />
    }
];
// Create the history object
const history = createBrowserHistory();

// Create the store, passing it the history object
const configuredStore = configureStore(history); //createStore(combineReducers(reducers), applyMiddleware(thunk));

// Start the history listener, which automatically dispatches actions to keep the store in sync with the history
startListener(history, configuredStore.store);

// Create the router
const router = new UniversalRouter(routes);

// Create the reactive render function
function render(pathname: string) {
    router.resolve(pathname).then((component: any) => {
        // console.log(component);

        ReactDOM.render(
            <Provider store={configuredStore.store}>
                <PersistGate loading={null} persistor={configuredStore.persistor}>
                    {component}
                </PersistGate>
            </Provider>,
            document.getElementById("root")
        );
    });
}

// Get the current pathname
let currentLocation = configuredStore.store.getState().router.pathname;

// Subscribe to the store location
const unsubscribe = configuredStore.store.subscribe(() => {
    const previousLocation = currentLocation;
    currentLocation = configuredStore.store.getState().router.pathname;

    if (previousLocation !== currentLocation) {
        console.log(
            "Some deep nested property changed from",
            previousLocation,
            "to",
            currentLocation
        );
        render(currentLocation);
    }
});

render(currentLocation);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
