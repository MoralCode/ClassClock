
import { Auth0Client } from '@auth0/auth0-spa-js';
import {Auth0, pages} from '../../utils/constants'

const auth0 = new Auth0Client({
	domain: Auth0.domain,
	client_id: Auth0.clientID,
	redirect_uri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
	cacheLocation: 'localstorage',
	useRefreshTokens: true
});

const authProvider = ({
  isAuthenticated,
  loginWithRedirect,
  loading,
  logout,
  user,
}) => ({
	login: () => {
		console.log("login")
		return (isAuthenticated && loading == false ? Promise.resolve() : Promise.reject())
	},
  logout: () => {
	console.log("logout")
	return logout({ returnTo: window.location.origin })
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
