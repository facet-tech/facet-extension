/*global chrome*/

import React, { useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import PopupContext from './PopupContext';
import styled from 'styled-components';

const StyledDiv = styled.div`
    width: 20rem;
    height: 20rem;
`;

export default () => {
    const { loggedInUser, setLoggedInUser } = useContext(PopupContext);

    const login = () => {
        chrome && chrome.identity && chrome.identity.getAuthToken({ 'interactive': true }, function (token) { });
    }

    // loggedInUser, setLoggedInUser
    useEffect(() => {
        const getProfile = () => {
            // getProfileUserInfo
            chrome && chrome.identity && chrome.identity.getProfileUserInfo(undefined, function (rr) {
                setLoggedInUser(rr);
            });
        }
        getProfile();
    }, []);

    const element = loggedInUser && loggedInUser.email ? < div >
        {'email:'} {loggedInUser.email}
    </div > : <StyledDiv onClick={() => login()}> Login </StyledDiv>;
    return <div>
        {element}
    </div>
}