// src/auth/auth0-provider-with-history.js
//from https://auth0.com/blog/complete-guide-to-react-user-authentication/
import React from 'react';
// import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { configuredStore } from '../store/store';
import { Auth0, pages } from '../utils/constants';
import { replace } from 'redux-first-routing';

const Auth0ProviderWithHistory = ({ children }: {children: React.ReactElement}) => {
	const domain = process.env.REACT_APP_AUTH0_DOMAIN;
	const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

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

	return (
		<Auth0Provider
			domain= { Auth0.domain }
			clientId = { Auth0.clientId }
			audience = { Auth0.audience }
			redirectUri = {(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "http://localhost:3000" + pages.loginCallback : "https://web.classclock.app/admin" + pages.loginCallback}
			onRedirectCallback = { onRedirectCallback }

		>
			{ children }
		</Auth0Provider>
	);
};

export default Auth0ProviderWithHistory;