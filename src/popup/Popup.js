import React from 'react';
import Button from '@material-ui/core/Button';
import { useAuth0 } from "@auth0/auth0-react";

export default () => {
    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
    } = useAuth0();

    return <div>
        <Button
            variant="contained"
            id="qsLoginBtn"
            color="primary"
            className="btn-margin"
            onClick={() => loginWithRedirect()}
        > Log in
        </Button>
    </div>
}