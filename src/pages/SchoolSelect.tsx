import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import IPageInterface from "../utils/IPageInterface";
import "../global.css";

import { selectSchool, fetchSchoolsList } from "../store/schools/actions";
import { useAuth0 } from "../react-auth0-wrapper";
import School from "../@types/school";

const SchoolSelect = (props: any) => {
    const { isAuthenticated, getTokenSilently } = useAuth0();

    useEffect(() => {
        // Update the document title using the browser API
        // document.title = `You clicked ${count} times`;
        const fetchSchools = async () => {
            const token = await getTokenSilently();
            if (isAuthenticated) {
                props.dispatch(
                    fetchSchoolsList(typeof token !== "undefined" ? token : "")
                );
            }
        };

        if (Object.getOwnPropertyNames(props.schools).length === 0) {
            fetchSchools();
        } else if (Object.getOwnPropertyNames(props.schools).length === 1) {
            setSchool(Object.getOwnPropertyNames(props.schools)[0]);
        }
    });

    const setSchool = (id: string) => {
        props.dispatch(selectSchool(id));
        props.dispatch(push("/"));
    };

    const list = Object.keys(props.schools).map((id: string) => (
        <li onClick={() => setSchool(id)} key={id}>
            {props.schools[id].data.fullName}
        </li>
    ));
    return <ul>{list}</ul>;
};

const mapStateToProps = (state: any, ownProps: any = {}) => {
    const { schoolsById } = state;
    return { schools: schoolsById };
};
export default connect(mapStateToProps)(SchoolSelect);
