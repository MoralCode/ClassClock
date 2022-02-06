// in src/MyLoginPage.js
import React, { useState } from 'react';
import { useLogin, useNotify, Notification, defaultTheme } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import { useAuth0 } from '../../react-auth0-wrapper';
import {pages} from "../../utils/constants";

const MyLoginPage = () => {
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

	const { isAuthenticated, loginWithRedirect, loading } = useAuth0();
	if (!isAuthenticated && loading == false) {
		loginWithRedirect({
			appState: { targetUrl: pages.admin }
		})
	}
	return (
		<ThemeProvider theme={createTheme(defaultTheme)}>
			{/* <form onSubmit={submit}>
				<input
					name="email"
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<input
					name="password"
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
			</form> */}
			<button onClick={() => loginWithRedirect({
				appState: { targetUrl: pages.admin }
			})}>Login with Auth0</button>
			<Notification />
		</ThemeProvider>
	);
};

export default MyLoginPage;