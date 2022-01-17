import React from "react";
import App from "../pages/App";
import Schedule from "../pages/Schedule";
import Settings from "../pages/Settings/Settings";
import PrivateRoute from "../components/PrivateRoute";
import SchoolSelect from "../pages/SchoolSelect";
import { pages } from "./constants";
import Admin from "../pages/Admin";
import {Admin as RAdmin, Resource, ListGuesser} from "react-admin";
import {dataProvider, authProvider, history} from "../store/store";
import { createBrowserHistory } from "history";

const adminHistory = createBrowserHistory({
    basename: "/admin"
});

const AdminPage = <RAdmin disableTelemetry dataProvider={dataProvider} history={adminHistory} authProvider={authProvider} title="ClassClock Admin">
    <Resource name="schools" list={ListGuesser} />
    <Resource name="bellschedules" list={ListGuesser} />
</RAdmin>

export const routes = [
    {
        path: pages.main,
        action: () => <App />
    },
    {
        path: pages.fullSchedule,
        action: () => <Schedule />
    },
    {
        path: pages.settings,
        action: () => <Settings />
    },
    {
        path: pages.selectSchool,
        action: () => <SchoolSelect />
    },
    {
        path: pages.admin,
        children: [],
        action: () => AdminPage
    },
    {
        path: pages.loginCallback,
        action: () => <p>Redirecting...</p>
    }
];
