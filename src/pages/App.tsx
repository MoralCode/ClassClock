import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import IPageInterface from "../utils/IPageInterface";
import "../global.css";
import Link from "../components/Link";
import Icon from "../components/Icon";
import Text from "../components/Text";

class App extends Component<IPageInterface, {}> {
    navigate = (to: string) => {
        this.props.dispatch(push(to));
    };

    render() {
        return (
            <div className="App">
                <Link
                    className="cornerNavButton smallIcon"
                    // tslint:disable-next-line: jsx-no-lambda
                    destination={() => this.navigate("/settings.html")}
                >
                    <Icon icon="fa-cog" />
                </Link>
                <br />
                <Text>It is currently: </Text>
                <Text className="timeFont" style={{ fontSize: "40px" }}>
                    10:33:45 AM
                </Text>
                <Text>
                    <span>on</span>
                    <b>Thurs, Jan 12, 2019</b>
                </Text>
                <section id="scheduleInfo" className="verticalFlex">
                    <p className="centered" id="schedule" />
                    <p className="centered" id="selectedSchoolDisplay" />
                    <Link
                        // tslint:disable-next-line: jsx-no-lambda
                        destination={() => this.navigate("/schedule.html")}
                        className="centered bottomSpace"
                        id="viewScheduleLink"
                    >
                        View Schedule
                    </Link>
                    <p className="centered label">You are currently in: </p>
                    <h1 className="centered bottomSpace" id="currentClass" />
                    <p className="centered label" id="countdownLabel">
                        ...which ends in:
                    </p>
                    <h1
                        className="centered bottomSpace time bigger"
                        id="timeToEndOfClass"
                    />
                    <p className="centered label">Your next class period is: </p>
                    <h1 className="centered bottomSpace" id="nextClass" />
                </section>
            </div>
        );
    }
}

export default connect()(App);
