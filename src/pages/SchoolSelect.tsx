import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import IPageInterface from "../utils/IPageInterface";
import "../global.css";

import { selectSchool } from "../store/schools/actions";
import { useAuth0 } from "../react-auth0-wrapper";
import School from "../@types/school";
import ClassClockService from "../services/classclock";

const SchoolSelect = (props: any) => {
    const { getTokenSilently } = useAuth0();

    const [schoolList, setSchoolList] = useState([]);
    const [lastRefresh, setlastRefresh] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (
            schoolList.length === 0 &&
            // isFetching === false &&
            Math.abs(new Date().getTime() - lastRefresh) > 120000 //120000 ms
        ) {
            const fetchSchools = async (abortSignal: AbortSignal) => {
                const token = await getTokenSilently();

                if (token !== undefined) {
                    try {
                        await ClassClockService.getSchoolsList(token, {
                            signal: abortSignal
                        })
                            .then(
                                (response: Response) => {
                                    if (response.ok) {
                                        return response.json();
                                    }
                                },
                                // Do not use catch, because that will also catch
                                // any errors in the dispatch and resulting render,
                                // causing a loop of 'Unexpected batch number' errors.
                                // https://github.com/facebook/react/issues/6895
                                (error: Error) => console.log("An error occurred.", error)
                            )
                            .then((json: any) => {
                                setSchoolList(
                                    json.data.map((value: any) =>
                                        School.fromJsonApi(value)
                                    )
                                );
                                setlastRefresh(new Date().getTime());
                            });
                    } catch (error) {
                        console.log(error.message, error.type);
                    }
                }
            };
            fetchSchools(signal);
        }

        return () => {
            controller.abort();
        };
    }, []);

    const setSchool = async (id: string) => {
        const token = await getTokenSilently();
        if (props.selectedSchool.data.id !== id && token !== undefined) {
            props.dispatch(selectSchool(token, id));
        }

        props.dispatch(push("/"));
    };
    const list = schoolList.map((school: School) => (
        <li
            key={school.getIdentifier()}
            onClick={() => setSchool(school.getIdentifier())}
        >
            {school.getName()}
        </li>
    ));

    return (
        <div>
            <h2>Please select a school</h2>
            {schoolList.length === 0 ? <span>Loading...</span> : <ul>{list}</ul>}

            {/* <a onClick={}>Refresh</a> */}
        </div>
    );
};

const mapStateToProps = (state: any) => {
    const { selectedSchool } = state;
    return { selectedSchool };
};
export default connect(mapStateToProps)(SchoolSelect);
