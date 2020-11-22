/*global chrome*/

import React, { useContext } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import Main from './Main';
import SignIn from '../authentication/SignIn';
import Signup from '../authentication/Signup';
import { authState as authStateConstant } from '../shared/constant';
import ConfirmationCode from '../authentication/ConfirmationCode';

const StyledDiv = styled.div`
    width: 20rem;
`;

export default () => {
    const { currAuthState } = useContext(PopupContext);
    let displayElement;
    if (currAuthState === authStateConstant.signingIn) {
        displayElement = <SignIn />;
    } else if (currAuthState === authStateConstant.signingUp) {
        displayElement = <Signup />
    } else if (currAuthState === authStateConstant.confirmingSignup) {
        displayElement = <ConfirmationCode />
    } else if (currAuthState === authStateConstant.signedIn) {
        displayElement = <Main />
    }

    return <StyledDiv>
        {displayElement}
    </StyledDiv>
}