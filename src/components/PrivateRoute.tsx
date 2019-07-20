import React, { useEffect } from "react";
import { useAuth0 } from "../react-auth0-wrapper";

const PrivateRoute = ({ component: Component, path, ...rest }: any) => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    useEffect(() => {
        const fn = async () => {
            if (!isAuthenticated) {
                await loginWithRedirect({
                    appState: { targetUrl: path }
                });
            }
        };
        fn();
    }, [isAuthenticated, loginWithRedirect, path]);

    const Render = (props: any) =>
        isAuthenticated === true ? <Component {...props} /> : null;

    return <Render />;
};

export default PrivateRoute;
