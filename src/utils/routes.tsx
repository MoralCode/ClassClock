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
        action: () => <PrivateRoute component={App} path={pages.main} />
    },
    {
        path: pages.fullSchedule,
        action: () => <PrivateRoute component={Schedule} path={pages.fullSchedule} />
    },
    {
        path: pages.settings,
        action: () => <PrivateRoute component={Settings} path={pages.settings} />
    },
    {
        path: pages.selectSchool,
        action: () => <PrivateRoute component={SchoolSelect} path={pages.selectSchool} />
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
