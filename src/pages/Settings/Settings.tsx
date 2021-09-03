import React from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import "../../global.css";
import "./settings.css";
import { ISchoolsState, SelectedSchoolState } from "../../store/schools/types";
import { ISettingsState, IUserSettings } from "../../store/usersettings/types";
import School from "../../@types/school";
import Link from "../../components/Link";
import { pages } from "../../utils/constants";
import { URLs } from "../../utils/constants";
import { setTimeFormatPreference } from "../../store/usersettings/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "../../react-auth0-wrapper";
import distanceInWords from "date-fns/distance_in_words";
import { selectSchool, invalidateSchool } from "../../store/schools/actions";
import packageJson from '../../package.alias.json';

export interface ISettingProps {
    selectedSchool: SelectedSchoolState;
    userSettings: IUserSettings;
    error: string;
    dispatch: any;
}

const Settings = (props: ISettingProps) => {
    const { logout, user, loginWithRedirect } = useAuth0();

    const navigate = (to: string) => {
        props.dispatch(push(to));
    };

    if (!props.selectedSchool.data && !props.selectedSchool.isFetching) {
        navigate(pages.selectSchool);
    }

    const getAdminButton = () => {
        let isOwner = false;

        let destination;
        let buttonText = isOwner ? "Edit Schedules" : "Log in to edit schedules";
        let hover = "Edit Schedules";

        if (user) {
            isOwner = props.selectedSchool.data.getOwnerIdentifier() === user.sub;
            destination = () => (isOwner ? navigate(pages.admin) : undefined);
            if (!isOwner) {
                hover = "You are not the owner of this class";
            }
        } else {
            destination = () =>
                loginWithRedirect({
                    appState: { targetUrl: pages.admin }
                });

            //TODO: maybe have it automatically find the school you ARE an admin of
        }

        return (
            <Link
                // tslint:disable-next-line: jsx-no-lambda
                destination={destination}
                title={hover}
            >
                <button disabled={undefined}>{buttonText}</button>
            </Link>
        );
    };

    const getVersionHTML = () => {
        if (process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA) {

            
            const version_sha = process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA.substring(0, 6)

            const githubURL = "https://" + packageJson.repository.replace(":", ".com/") + "/commit/"
            
            return <>(<a href={githubURL + version_sha}>{version_sha}</a>)</>
        } else {
            return <></>
        }
    }

    const selectedSchoolInfo = () => {
        if (props.selectedSchool.isFetching) {
            return <span>Loading School...</span>
        } else if (props.error) {
            return <span>An Error Occurred</span>
        } else {
            return <>
                <Link
                    // tslint:disable-next-line: jsx-no-lambda
                    destination={() => navigate(pages.selectSchool)}
                    title="Change School"
                >
                    {props.selectedSchool.data.getName() + " "}
                </Link>
                <br />
                <em className="smallerText">
                    Last updated{" "}
                    {distanceInWords(
                        new Date(),
                        new Date(props.selectedSchool.lastUpdated)
                    ) + " ago "}
                </em>

                <em className="smallerText">
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
                </em>
            </>
        }
    }

    return (
        <div>
            <Link
                className="cornerNavButton cornerNavTop cornerNavLeft smallIcon"
                // tslint:disable-next-line: jsx-no-lambda
                destination={() => navigate(pages.main)}
            >
                <FontAwesomeIcon icon={faHome} />
            </Link>
            {user && (
                <Link
                    className="cornerNavButton cornerNavTop cornerNavRight smallIcon"
                    // tslint:disable-next-line: jsx-no-lambda
                    destination={() => {
                        logout();
                    }}
                    title="Log Out"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </Link>
            )}

            <h1>Settings</h1>
            <h2 className="settingsHeader centeredWidth">Selected School: </h2>
            <div>
                {selectedSchoolInfo()}
                <br />
                <br />
                {getAdminButton()}
            </div>
            <h2 className="settingsHeader centeredWidth">Time Display:</h2>
            <label>
                Use 24-hour Time?{" "}
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
                Created by: <a href={process.env.REACT_APP_AUTHORURL}>Adrian Edwards</a>{" "}
                and <a href="https://nickthegroot.com/">Nick DeGroot</a>
                <br />
                Idea by: <a href="https://twitter.com/MrKumprey">Dan Kumprey</a>
            </p>
            <p style={{ fontSize: "smaller" }}>ClassClock version {packageJson.version} {getVersionHTML()}</p>
        </div>
    );
};

const mapStateToProps = (state: ISchoolsState & ISettingsState & {error: string}) => {
    const { selectedSchool, userSettings, error } = state;
    return {
        selectedSchool: Object.assign({}, selectedSchool, {
            data: School.fromJson(selectedSchool.data)
        }),
        userSettings,
        error
    };
};

export default connect(mapStateToProps)(Settings);
