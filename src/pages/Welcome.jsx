import React, { useContext } from 'react';
import { isBrowser } from 'react-device-detect';
import { setTitle } from '../app.functions';
import Context from '../functions/Context';
import "./../styles/welcome.css";

function Welcome() {

    setTitle("Welcome");

    if (isBrowser) {
        return (
            <div className="window welcome-window">
                <WelcomeScreen />
            </div>
        )
    }
    return (
        <WelcomeScreen />
    );
};

export default Welcome;

function WelcomeScreen() {
    const {app, goto} = useContext(Context);

    return (
        <div className="section welcome">
            <div className="welcome-header">
                <img className="welcome-icon" src="/logo192.png" alt="" />
                <span className="welcome-text">MeChat</span>
            </div>
            <lottie-player src="https://assets.myoasis.tech/chat/green_blue_char_02020.json" background="transparent" speed=".8" style={{ maxWidth: "320px", width: "100%", margin: "auto" }} loop autoplay></lottie-player>
            <div className="welcome-footer">
                <button className="welcome-button button button-blue" onClick={() => goto('/accounts')}>Continue to {app.name}</button>
                <div className="welcome-policy">By continuing to this website you agree to our <a href={app.pathname + "/legal"} target="_blank" rel="noopener noreferrer">Privacy policy</a> and <a href={app.pathname + "/legal/terms"} target="_blank" rel="noopener noreferrer">Terms of Usage</a>.</div>
                <div className="welcome-version">Version: {app.version}</div>
            </div>
        </div>
    );
}