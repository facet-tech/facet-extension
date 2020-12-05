/* global chrome */

import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import isUserLoggedIn from '../shared/isUserLoggedIn';
import isDevelopment from '../utils/isDevelopment';
import Main from './Main';
import logo from '../static/images/fn_horizontal_logo.png';
import FacetButton from '../shared/FacetButton';

export default () => {
    const StyledDiv = styled.div`
        width: 20rem;
        text-align: center;
    `;

    const [hasUserLoggedIn, setHasUserLoggedIn] = useState(false);

    useEffect(() => {
        // Create an scoped async function in the hook
        async function loadState() {
            const userHasLoggedIn = await isUserLoggedIn();
            setHasUserLoggedIn(userHasLoggedIn);
        }
        loadState();
    }, []);

    const onLoginClick = () => {
        // todo open new tab with auth stuff
        if (isDevelopment) {
            setHasUserLoggedIn(true);
        }
        chrome?.tabs?.query({ active: true, currentWindow: true }, function (tabs) {
            var currTab = tabs[0];
            chrome.tabs.create({ url: chrome.extension.getURL(`authentication.html?redirectTabId=${currTab.id}`) });
        });
    }

    const element = hasUserLoggedIn ? <Main /> : <div>
        <img src={logo} />
        <FacetButton style={{ width: "100%" }} variant="contained" color="primary" type="submit" text="Sign in" onClick={() => onLoginClick()}></FacetButton>
    </div>

    return <StyledDiv>
        {element}
    </StyledDiv>
}