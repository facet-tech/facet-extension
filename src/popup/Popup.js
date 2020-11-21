/*global chrome*/

import React, { useContext, useState } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import Authentication from './Authentication';
import Main from './Main';
import AmplifyAuthentication from './AmplifyAuthentication';
import { Auth } from 'aws-amplify';
import Login from '../authentication/Login';
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

    async function signupClick(username, password, email, phone_number) {
        try {
            const { user } = await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                }
            });
            console.log("CHECKME", user);
        } catch (error) {
            console.log('error signing up:', error);
        }
    }

    //signUp('waaaawdatawest123123', 'Taaawdaawdadwesawt123123', 'mtreamer333@gmail.com', '1232313231')
    console.log('PGG!', loadLogin);
    let displayElement;
    if (loadLogin) {
        displayElement = <Login />;
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