/*global chrome*/

import React, { useContext, useState } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import Authentication from './Authentication';
import Main from './Main';
import AmplifyAuthentication from './AmplifyAuthentication';
import { Auth } from 'aws-amplify';
import SignIn from '../authentication/SignIn';
import Signup from '../authentication/Signup';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 45% 45%;
    grid-gap: 5%;
    align-items: center;
`;

const MarginTop = styled.div`
    margin-top: ${props => props.value};
`;

const StyledDiv = styled.div`
    width: 20rem;
`;

const StyledSpan = styled.span`
    font-size: .5rem;
    word-break: break-all;
`;

export default () => {
    const { enqueueSnackbar } = useSnackbar();
    const { isUserAuthenticated, setIsUserAuthenticated, loadLogin } = useContext(PopupContext);

    let displayElement;
    if (loadLogin) {
        displayElement = <SignIn />;
    } else if (!isUserAuthenticated) {
        displayElement = <Signup />
    } else {
        displayElement = <Main />
    }

    // displayElement = !isUserAuthenticated ? <Signup /> : <Main />;

    return <StyledDiv>
        {displayElement}
    </StyledDiv>
}