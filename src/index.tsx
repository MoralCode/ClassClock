import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { browserTracingIntegration } from "@sentry/react";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import UniversalRouter, {Context} from "universal-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { pages } from "./utils/constants";
import { routes } from "./utils/routes";
import { PageNotFound } from "./pages/errors/PageNotFound";
import { ServerError } from "./pages/errors/ServerError";
import {history, configuredStore} from "./store/store";
import Auth0ProviderWithHistory from "./services/auth0-provider-with-history";
import { Store } from "redux";
import { History, BrowserHistory, Update } from "history";
import { locationChange } from "redux-first-routing";
import packageJson from './package.alias.json';



if (process.env.REACT_APP_SENTRY_DSN && process.env.REACT_APP_SENTRY_DSN !== "") {

    let version_information = "classclockweb@"+ packageJson.version;
    if (process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA) {
        version_information += "_" + process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA.substring(0, 6)
    }

    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [browserTracingIntegration()],
        release: version_information,

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}

function startListener(history: History, store:Store) {
    store.dispatch(locationChange({
        pathname: history.location.pathname,
        search: history.location.search,
        hash: history.location.hash,
    }));

    history.listen((update: Update) => {
        store.dispatch(locationChange({
            pathname: update.location.pathname,
            search: update.location.search,
            hash: update.location.hash,
        }));
    });
}


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
