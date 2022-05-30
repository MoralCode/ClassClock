// in src/LoginRedirect.js
import React, { useState } from 'react';
import { useLogin, useNotify, Notification, defaultTheme } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import { useAuth0 } from '@auth0/auth0-react';
import {pages} from "../../utils/constants";

const LoginRedirect = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const login = useLogin();
	const notify = useNotify();
	const submit = (e:any) => {
		e.preventDefault();
		login({ email, password }).catch(() =>
			notify('Invalid email or password')
		);
	};

	const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
	if (!isAuthenticated && isLoading == false) {
		loginWithRedirect({
			appState: { targetUrl: pages.adminBellSchedule }
		})
	}
	return (
		<p>Redirecting you to the login page...</p>
	);
};

export default LoginRedirect;