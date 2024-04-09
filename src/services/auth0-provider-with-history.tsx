// src/auth/auth0-provider-with-history.js
//from https://auth0.com/blog/complete-guide-to-react-user-authentication/
import React from 'react';
// import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { configuredStore } from '../store/store';
import { pages } from '../utils/constants';
import { replace } from 'redux-first-routing';

const Auth0ProviderWithHistory = ({ children }: {children: React.ReactElement}) => {
	const domain = process.env.REACT_APP_AUTH0_DOMAIN;
	const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
	const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
	const env = process.env.REACT_APP_VERCEL_ENV; //https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables

	// A function that routes the user to the right place
	// after login
	const onRedirectCallback = (appState: any) => {
		// Temporary Firefox workaround: https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md
		window.location.hash = window.location.hash; // eslint-disable-line no-self-assign

		configuredStore.store.dispatch(
			replace(
				appState && appState.targetUrl ? appState.targetUrl : window.location.pathname
			)
		);
	};

	let redirectCallbackUrl = "http://localhost:3000";

	//development is the default case
	if (env === 'preview') {
		redirectCallbackUrl = "https://beta.web.classclock.app"
	} else if (env === 'production' || process.env.NODE_ENV === 'production') {
		redirectCallbackUrl = "https://web.classclock.app"
	} 
	
	redirectCallbackUrl = redirectCallbackUrl + pages.loginCallback 

	return (
		<Auth0Provider
			domain= { domain }
			clientId = { clientId }
			audience = { audience }
			redirectUri = {redirectCallbackUrl}
			onRedirectCallback = { onRedirectCallback }
			cacheLocation={"localstorage"}
		>
			{ children }
		</Auth0Provider>
	);
};

export default Auth0ProviderWithHistory;