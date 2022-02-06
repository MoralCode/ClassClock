
import { LogoutOptions, RedirectLoginOptions } from '@auth0/auth0-spa-js';
import { AuthProvider } from 'react-admin';
import {Auth0, pages} from '../../utils/constants'

const authProvider = (
	isAuthenticated: boolean,
	loading: boolean,
	logout: (o?: LogoutOptions) => void,
	user:any,
) => ({
	login: () => {
		console.log("login")
		return (isAuthenticated && loading == false ? Promise.resolve() : Promise.reject())
	},
  logout: () => {
	console.log("logout")
	logout()
	return (isAuthenticated && loading == false ? Promise.resolve() : Promise.reject())
	},
  checkError: () => {
	console.log("checkError")
	return Promise.resolve()
	},
  checkAuth: () => {
	console.log("checkAuth: " + isAuthenticated)
	  return ((isAuthenticated || loading) ? Promise.resolve() : Promise.reject())
	},
  getPermissions: () => {
	console.log("getPermissions")
	return Promise.reject('Unknown method')
	},
  getIdentity: () =>
    Promise.resolve({
      id: user.id,
      fullName: user.name,
      avatar: user.picture,
    }),
});

export default authProvider;
