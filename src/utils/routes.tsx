import React from "react";
import App from "../pages/App";
import Schedule from "../pages/Schedule";
import Settings from "../pages/Settings/Settings";
import PrivateRoute from "../components/PrivateRoute";
import SchoolSelect from "../pages/SchoolSelect";
import { pages } from "./constants";
import Admin from "../pages/Admin";
import {Admin as RAdmin, Resource, ListGuesser} from "react-admin";
import {dataProvider, history} from "../store/store";
import authProvider from "../pages/Admin/authProvider";
import { createBrowserHistory } from "history";
import MyLoginPage from "../pages/Admin/MyLoginPage";
import { useAuth0 } from "../react-auth0-wrapper";

const adminHistory = createBrowserHistory({
    basename: "/admin"
});

const AdminPage = () => {

    const {
        isAuthenticated,
        logout,
        loginWithRedirect,
        loading,
        error,
        user,
    } = useAuth0();

    const customAuthProvider = authProvider({
        isAuthenticated,
        loginWithRedirect,
        loading,
        logout,
        user,
    });

    return (<RAdmin disableTelemetry dataProvider={dataProvider} history={adminHistory} authProvider={customAuthProvider} loginPage={MyLoginPage} title="ClassClock Admin">
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
