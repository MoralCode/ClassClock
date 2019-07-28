import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import IPageInterface from "../utils/IPageInterface";
import "../global.css";
import { IState } from "../store/schools/types";
import { IState as UserSettingsIState } from "../store/usersettings/types";
import School from "../@types/school";
import Link from "../components/Link";
import { pages } from "../utils/constants";
import Icon from "../components/Icon";
import { URLs } from "../utils/constants";
import { setTimeFormatPreference } from "../store/usersettings/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";

export interface ISettingProps {
    selectedSchoolName: string;
    userSettings: { use24HourTime: boolean }; //this is duplicated. ugh
    dispatch: any;
}

const Settings = (props: ISettingProps) => {
    const navigate = (to: string) => {
        props.dispatch(push(to));
    };

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
            <label>
                <b>Use 24-hour Time?</b>
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

            <p>
                <b>Selected School:</b>{" "}
                <Link
                    // tslint:disable-next-line: jsx-no-lambda
                    destination={() => navigate(pages.selectSchool)}
                    title="Change School"
                >
                    {props.selectedSchoolName}
                </Link>
            </p>
            <em>Settings are automatically saved</em>

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
        selectedSchoolName: School.fromJson(selectedSchool.data).getName(),
        userSettings
    };
};

export default connect(mapStateToProps)(Settings);
