import React from "react";
import App from "../pages/App";
import Schedule from "../pages/Schedule";
import Settings from "../pages/Settings/Settings";
import SchoolSelect from "../pages/SchoolSelect";
import { pages } from "./constants";
import Welcome from "../pages/Welcome";
import AdminPage from "../pages/Admin/AdminPage";

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
        path: pages.fullScheduleLegacy,
        action: () => <Schedule />
    },
    {
        path: pages.settingsLegacy,
        action: () => <Settings />
    },
    {
        path: pages.selectSchool,
        action: () => <SchoolSelect />
    },
    {
        path: pages.welcome,
        action: () => <Welcome />
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
