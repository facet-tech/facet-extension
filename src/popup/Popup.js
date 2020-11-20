/*global chrome*/

import React, { useContext } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import Authentication from './Authentication';
import Main from './Main';
import AmplifyAuthentication from './AmplifyAuthentication';
import { Auth } from 'aws-amplify';

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
    const { isUserAuthenticated, setIsUserAuthenticated } = useContext(PopupContext);

    async function signUp(username, password, email, phone_number) {
        try {
            const { user } = await Auth.signUp({
                username,
                password,
                attributes: {
                    email,          // optional
                    // other custom attributes 
                }
            });
            console.log("CHECKME", user);
        } catch (error) {
            console.log('error signing up:', error);
        }
    }

    //signUp('waaaawdatawest123123', 'Taaawdaawdadwesawt123123', 'mtreamer333@gmail.com', '1232313231')



    const element = !isUserAuthenticated ? <Authentication /> : <Main />;

    return <StyledDiv>
        {element}
    </StyledDiv>
}