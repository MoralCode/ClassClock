import React from "react";
import App from "../pages/App";
import Schedule from "../pages/Schedule";
import Settings from "../pages/Settings";
import PrivateRoute from "../components/PrivateRoute";
import SchoolSelect from "../pages/SchoolSelect/SchoolSelect";
import { pages } from "./constants";
import Admin from "../pages/Admin";

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
        action: () => <PrivateRoute component={Admin} path={pages.admin} />
    },
    {
        path: pages.loginCallback,
        action: () => <p>Redirecting...</p>
    }
];
