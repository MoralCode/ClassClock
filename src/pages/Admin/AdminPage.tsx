import React from "react";
import { Admin as RAdmin, Resource, ListGuesser, EditGuesser, EditButton, DeleteButton} from "react-admin";
import ccDataProvider from "../../services/classclock-dataprovider"
import authProvider from "../../pages/Admin/authProvider";
import { useAuth0 } from "@auth0/auth0-react";
import ClassClockService from "../../services/classclock";
import { createBrowserHistory } from "history";
import LoginRedirect from "./LoginRedirect";
import { BellScheduleCreate, BellscheduleEdit, BellScheduleList, SchoolList } from "./resources";


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

    return (<RAdmin disableTelemetry dataProvider={ccDataProvider(ClassClockService.baseURL, getAccessTokenSilently)} history={adminHistory} authProvider={customAuthProvider} loginPage={LoginRedirect} title="ClassClock Admin">
      <Resource name="school" />
      <Resource name="bellschedule" options={{ label: 'Bell Schedules' }} list={BellScheduleList} edit={BellscheduleEdit} create={BellScheduleCreate} />
    </RAdmin>)
}

export default AdminPage;