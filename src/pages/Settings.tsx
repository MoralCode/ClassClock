import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";
import IPageInterface from "../utils/IPageInterface";
import "../global.css";

export class Settings extends Component<IPageInterface, {}> {
    // document.getElementById("use24HourTime").checked = getLocalStorageBoolean("use24HourTime");

    public updateSettings() {
        // localStorage.setItem("use24HourTime", document.getElementById("use24HourTime").checked);
    }

    // inpit: onchange="updateSettings()"
    render() {
        return (
            <div>
                <a className="navbutton" href="index.html">
                    <i className="fas fa-home" />
                </a>
                <br />
                <section id="options" className="centered topSpace">
                    <label>
                        Use 24-hour Time?
                        <input type="checkbox" id="use24HourTime" />
                    </label>
                    <em>Settings are automatically saved</em>
                </section>
                <section id="credits" className="centered topSpace">
                    <ul className="footer__social">
                        <li>
                            <a href="{{ site.githubURL }}">
                                <i className="fab fa-github" aria-hidden="true" />
                            </a>
                        </li>
                        <li>
                            <a href="{{ site.twitterURL }}">
                                <i className="fab fa-twitter" aria-hidden="true" />
                            </a>
                        </li>
                        <li>
                            <a href="{{ site.instagramURL }}">
                                <i className="fab fa-instagram" aria-hidden="true" />
                            </a>
                        </li>
                    </ul>
                    <p id="credits">
                        Created by:{" "}
                        <a href="https://www.adriancedwards.com">Adrian Edwards</a> and
                        <a href="https://nbdeg.com/">Nick DeGroot</a>
                        <br />
                        Idea by: <a href="https://twitter.com/MrKumprey">Dan Kumprey</a>
                    </p>
                </section>
            </div>
        );
    }
}

export default connect()(Settings);
