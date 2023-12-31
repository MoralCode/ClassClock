import React from "react";
import { Admin as RAdmin, Resource, ListGuesser, EditGuesser, EditButton, DeleteButton, CustomRoutes} from "react-admin";
import ccDataProvider from "../../services/classclock-dataprovider"
import authProvider from "../../pages/Admin/authProvider";
import { useAuth0 } from "@auth0/auth0-react";
import ClassClockService from "../../services/classclock";
import { BrowserRouter } from 'react-router-dom';
import LoginRedirect from "./LoginRedirect";
import { BellScheduleCreate, BellscheduleEdit, BellScheduleList } from "./resources";
import { Route } from "react-router-dom";

import { Card, CardContent } from '@mui/material';
import { Title } from 'react-admin';


const AdminPage = () => {

    const {
        isAuthenticated,
        logout,
        isLoading,
        user,
        getAccessTokenSilently
    } = useAuth0();

    const customAuthProvider = authProvider(isAuthenticated, isLoading, logout, user);

    return (
      <BrowserRouter
      basename="/admin">
        <RAdmin disableTelemetry dataProvider={ccDataProvider(ClassClockService.baseURL, getAccessTokenSilently)} authProvider={customAuthProvider} loginPage={LoginRedirect} title="ClassClock Admin">
          <Resource name="school" />
          <Resource name="bellschedule" options={{ label: 'Bell Schedules' }} list={BellScheduleList} edit={BellscheduleEdit} create={BellScheduleCreate} />
          <CustomRoutes>
            <Route path="/" element={
              <Card>
                <Title title="ClassClock Admin" />
                <p>Welcome to the ClassClock Admin page.</p>
                <p>Use the menu on the left to select what part of the app you would like to edit</p>
                <br/>
                <p>This admin page is designed to work on desktop devices.<br/>Use on a mobile device is not currently supported.</p>
              </Card>
            } />
          </CustomRoutes>

        </RAdmin>
    </BrowserRouter>)
}

export default AdminPage;