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

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: any) => {
    // Temporary Firefox workaround: https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md
    window.location.hash = window.location.hash; // eslint-disable-line no-self-assign

    configuredStore.store.dispatch(
        replace(
            appState && appState.targetUrl ? appState.targetUrl : window.location.pathname
        )
    );
};

// Create the reactive render function
function render(pathname: string) {
    router.resolve(pathname).then((component: any) => {
        const Core = <Auth0Provider
            domain={Auth0.domain}
            client_id={Auth0.clientId}
            audience={Auth0.audience}
            redirect_uri={(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "http://localhost:3000" : "https://web.classclock.app" + pages.loginCallback}
            onRedirectCallback={onRedirectCallback}
        >
            {component}
        </Auth0Provider>

        //react-admin detects if its in a provider, so those pages cane be shown with the existing provider
        if (!pathname.includes(pages.admin)) {

            ReactDOM.render(
                <Provider store={configuredStore.store}>
                    <PersistGate loading={null} persistor={configuredStore.persistor}>
                        {Core}
                    </PersistGate>
                </Provider>,
                document.getElementById("root")
            );
        } else {
            ReactDOM.render(Core,
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
