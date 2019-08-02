import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../global.css";
import School from "../@types/school";
import { pages } from "../utils/constants";
import BellSchedule from "../@types/bellschedule";
import { IState } from "../store/schools/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "../react-auth0-wrapper";

export interface IAdminProps {
    selectedSchool: {
        isFetching: boolean;
        didInvalidate: false;
        data: School;
    };
    dispatch: any;
}

const Admin = (props: IAdminProps) => {
    const { user, getTokenSilently } = useAuth0();

    const navigate = (to: string) => {
        props.dispatch(push(to));
    };

    if (props.selectedSchool.data.getOwnerIdentifier() !== user.id) {
        //user does not own school
        navigate(pages.main);
    }

    return <></>;
};

const mapStateToProps = (state: IState) => {
    const { selectedSchool } = state;
    selectedSchool.data = School.fromJson(selectedSchool.data);
    return { selectedSchool };
};

export default connect(mapStateToProps)(Admin);
