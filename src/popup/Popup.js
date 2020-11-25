/*global chrome*/

import React, { useContext, useState, useEffect } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import Main from './Main';
import SignIn from '../authentication/SignIn';
import Signup from '../authentication/Signup';
import { authState as authStateConstant } from '../shared/constant';
import ConfirmationCode from '../authentication/ConfirmationCode';
import ForgotPassword from '../authentication/ForgotPassword';
import PasswordReset from '../authentication/PasswordReset';
// import useEffectAsync from '../shared/hooks/useEffectAsync';
import AmplifyService from '../services/AmplifyService';
import { Auth } from 'aws-amplify';
const StyledDiv = styled.div`
    width: 20rem;
`;

export default () => {
    const { currAuthState } = useContext(PopupContext);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState('');

    useEffect(() => {
        (async () => {
            const result = await Auth.currentSession();
            const jwtToken = result?.accessToken?.jwtToken;
            setIsUserLoggedIn(jwtToken);
        })();
    }, []);

    // useEffectAsync(async () => {
    //     const jwt = await AmplifyService.getCurrentUserJTW();
    //     setIsUserLoggedIn(jwt);
    // }, []);

    let displayElement;
    if (isUserLoggedIn || currAuthState === authStateConstant.signedIn) {
        displayElement = <Main />;
    }
    else if (currAuthState === authStateConstant.signingIn) {
        displayElement = <SignIn />;
    } else if (currAuthState === authStateConstant.signingUp) {
        displayElement = <Signup />
    } else if (currAuthState === authStateConstant.confirmingSignup) {
        displayElement = <ConfirmationCode />
    } else if (currAuthState === authStateConstant.signedIn) {
        displayElement = <Main />
    } else if (currAuthState === authStateConstant.onForgotPassword) {
        displayElement = <ForgotPassword />;
    } else if (currAuthState === authStateConstant.onPasswordReset) {
        displayElement = <PasswordReset />;
    } else {
        displayElement = <SignIn />;
    }

    return <StyledDiv>
        {displayElement}
    </StyledDiv>
}