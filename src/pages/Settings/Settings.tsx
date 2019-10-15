import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import IPageInterface from "../../utils/IPageInterface";
import "../global.css";
import { IState } from "../../store/schools/types";
import { IState as UserSettingsIState } from "../../store/usersettings/types";
import School from "../../@types/school";
import Link from "../../components/Link";
import { pages } from "../../utils/constants";
import Icon from "../../components/Icon";
import { URLs } from "../../utils/constants";
import { setTimeFormatPreference } from "../../store/usersettings/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faHome, faSignOutAlt, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "../../react-auth0-wrapper";
import format from "date-fns/format";
import { selectSchool, invalidateSchool } from "../../store/schools/actions";

export interface ISettingProps {
    selectedSchool: any;
    userSettings: { use24HourTime: boolean }; //this is duplicated. ugh
    dispatch: any;
}

const Settings = (props: ISettingProps) => {
    const { logout, user, loginWithRedirect } = useAuth0();

    const navigate = (to: string) => {
        props.dispatch(push(to));
    };

    if (props.selectedSchool.data === {} && !props.selectedSchool.isFetching) {
        navigate(pages.selectSchool);
    }

    return (
        <div>
            <Link
                className="cornerNavButton smallIcon"
                // tslint:disable-next-line: jsx-no-lambda
                destination={() => navigate(pages.main)}
            >
                <FontAwesomeIcon icon={faHome} />
            </Link>
            <br />

            <h1>Settings</h1>
            {user ? (
                <span>
                    Hello <b>{user.name || user.email}</b> (
                    <Link
                        // tslint:disable-next-line: jsx-no-lambda
                        destination={() => {
                            logout();
                            props.dispatch(invalidateSchool());
                        }}
                        title="Log Out"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                    </Link>
                    )
                </span>
            ) : (
                <Link
                    // tslint:disable-next-line: jsx-no-lambda
                    destination={() =>
                        loginWithRedirect({
                            appState: { targetUrl: pages.settings }
                        })
                    }
                    title="Admin Login"
                >
                    Admin Log In
                </Link>
            )}

            <p>
                {props.selectedSchool.isFetching ? (
                    <span>Loading School...</span>
                ) : (
                    <b>{props.selectedSchool.data.getName() + " "}</b>
                )}
                <br />
                <em className="smallerText">
                    (
                    <Link
                        // tslint:disable-next-line: jsx-no-lambda
                        destination={() => navigate(pages.selectSchool)}
                        title="Change School"
                    >
                        Change School
                    </Link>
                    )
                </em>
                {user && props.selectedSchool.data.getOwnerIdentifier() === user.sub ? (
                    <em className="smallerText">
                        (
                        <Link
                            // tslint:disable-next-line: jsx-no-lambda
                            destination={() => navigate(pages.admin)}
                            title="Manage School"
                        >
                            Manage School
                        </Link>
                        )
                    </em>
                ) : (
                    undefined
                )}
                <br />
                <em className="smallerText">
                    Updated:{" "}
                    {format(
                        new Date(props.selectedSchool.lastUpdated),
                        "MMM D YYYY h:mm:ss a"
                    ) + " "}
                </em>
                {!props.selectedSchool.isFetching ? (
                    <em className="smallerText">
                        (
                        <Link
                            // tslint:disable-next-line: jsx-no-lambda
                            destination={() =>
                                props.dispatch(
                                    selectSchool(
                                        props.selectedSchool.data.getIdentifier()
                                    )
                                )
                            }
                            title="Reload Schedule"
                        >
                            Refresh
                        </Link>
                        )
                    </em>
                ) : (
                    undefined
                )}
            </p>
            <label>
                <b>Use 24-hour Time?</b>{" "}
                <input
                    type="checkbox"
                    checked={props.userSettings.use24HourTime}
                    // tslint:disable-next-line: jsx-no-lambda
                    onChange={() => {
                        props.dispatch(
                            setTimeFormatPreference(!props.userSettings.use24HourTime)
                        );
                    }}
                />
            </label>
            <br />
            <p>
                <em className="smallerText">
                    Settings are automatically saved on your device
                </em>
            </p>

            <p style={{ marginTop: "20vh" }}>Follow ClassClock:</p>
            <ul className="footer__social">
                <li>
                    <Link destination={URLs.github}>
                        <FontAwesomeIcon icon={faGithub} />
                    </Link>
                </li>
                <li>
                    <Link destination={URLs.twitter}>
                        <FontAwesomeIcon icon={faTwitter} />
                    </Link>
                </li>
                <li>
                    <Link destination={URLs.instagram}>
                        <FontAwesomeIcon icon={faInstagram} />
                    </Link>
                </li>
            </ul>
            <p id="credits">
                Created by: <a href="https://www.adriancedwards.com">Adrian Edwards</a>{" "}
                and <a href="https://nbdeg.com/">Nick DeGroot</a>
                <br />
                Idea by: <a href="https://twitter.com/MrKumprey">Dan Kumprey</a>
            </p>
        </div>
    );
};

const mapStateToProps = (state: IState & UserSettingsIState) => {
    const { selectedSchool, userSettings } = state;
    return {
        selectedSchool: Object.assign({}, selectedSchool, {
            data: School.fromJson(selectedSchool.data)
        }),
        userSettings
    };
};

export default connect(mapStateToProps)(Settings);
