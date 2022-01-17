// in src/MyLoginPage.js
import React, { useState } from 'react';
import { useLogin, useNotify, Notification, defaultTheme } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';

const MyLoginPage = (props: any) => {
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

	return (
		<ThemeProvider theme={createTheme(defaultTheme)}>
			<form onSubmit={submit}>
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
			</form>
			<Notification />
		</ThemeProvider>
	);
};

export default MyLoginPage;