import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { startListener, push, replace } from "redux-first-routing";
import UniversalRouter, {Context} from "universal-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Auth0Provider } from "./react-auth0-wrapper";
import { Auth0, pages } from "./utils/constants";
import { routes } from "./utils/routes";
import { PageNotFound } from "./pages/errors/PageNotFound";
import { ServerError } from "./pages/errors/ServerError";
import {history, configuredStore} from "./store/store";
import Auth0ProviderWithHistory from "./services/auth0-provider-with-history";


// Start the history listener, which automatically dispatches actions to keep the store in sync with the history
startListener(history, configuredStore.store);

const options = {
    errorHandler(error: { status?: number; }, context: Context) {
        console.error(error)
        console.info(context)
        
        return error.status === 404
            ? <PageNotFound />
            : <ServerError />
    }
}

// Create the router
const router = new UniversalRouter(routes, options);

// Create the reactive render function
function render(pathname: string) {
    router.resolve(pathname).then((component: any) => {
        const core = <Auth0ProviderWithHistory>
            {component}
        </Auth0ProviderWithHistory>

        //react-admin detects if its in a provider, so those pages cane be shown with the existing provider
        if (!pathname.includes(pages.admin)) {

            ReactDOM.render(
                <Provider store={configuredStore.store}>
                    <PersistGate loading={null} persistor={configuredStore.persistor}>
                        {core}
                    </PersistGate>
                </Provider>,
                document.getElementById("root")
            );
        } else {
            ReactDOM.render(core,
                document.getElementById("root")
            );
        }
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
