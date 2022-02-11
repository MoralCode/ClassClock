import React from "react";
import App from "../pages/App";
import Schedule from "../pages/Schedule";
import Settings from "../pages/Settings/Settings";
import PrivateRoute from "../components/PrivateRoute";
import SchoolSelect from "../pages/SchoolSelect";
import { pages } from "./constants";
import Admin from "../pages/Admin";
import {Admin as RAdmin, Resource, ListGuesser} from "react-admin";
import {history} from "../store/store";
import ccDataProvider from "../services/classclock-dataprovider"
import authProvider from "../pages/Admin/authProvider";
import { createBrowserHistory } from "history";
import LoginRedirect from "../pages/Admin/LoginRedirect";
import { useAuth0 } from "@auth0/auth0-react";
import ClassClockService from "../services/classclock";

const adminHistory = createBrowserHistory({
    basename: "/admin"
});

const AdminPage = () => {

    const {
        isAuthenticated,
        logout,
        isLoading,
        user,
        getAccessTokenSilently
    } = useAuth0();

    const customAuthProvider = authProvider(isAuthenticated, isLoading, logout, user);

    return (<RAdmin disableTelemetry dataProvider={ccDataProvider(ClassClockService.baseURL, undefined, getAccessTokenSilently)} history={adminHistory} authProvider={customAuthProvider} loginPage={LoginRedirect} title="ClassClock Admin">
        <Resource name="schools" list={ListGuesser} />
        <Resource name="bellschedules" list={ListGuesser} />
    </RAdmin>)
}

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
        action: () => <AdminPage/>
    },
    {
        path: pages.loginCallback,
        action: () => <p>Redirecting...</p>
    }
];
