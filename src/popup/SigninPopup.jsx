/* global chrome */

import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import isUserLoggedIn from '../shared/isUserLoggedIn';
import isDevelopment from '../utils/isDevelopment';
import Main from './Main';
import logo from '../static/images/facet_main_logo.svg';
import FacetButton from '../shared/FacetButton';
import FacetLabel from '../shared/FacetLabel';
import FacetLink from '../shared/FacetLink';
import StyledPopupDiv from './StyledPopupDiv';
import { color } from '../shared/constant';

const StyledDiv = styled.div`
    width: 25rem;
    background-color: ${color.darkGray};
`;

const InnerStyledDiv = styled.div`
    padding: 2rem;
`;

export default () => {

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

    const onRegisterClick = () => {
        // todo open new tab with auth stuff
        if (isDevelopment) {
            setHasUserLoggedIn(true);
        }
        chrome?.tabs?.query({ active: true, currentWindow: true }, function (tabs) {
            var currTab = tabs[0];
            chrome.tabs.create({ url: chrome.extension.getURL(`authentication.html?redirectTabId=${currTab.id}&type=register`) });
        });
    }

    const element = hasUserLoggedIn ? <Main /> : <StyledPopupDiv>
        <InnerStyledDiv>
            <br />
            <img src={logo} />
            <br />
            <br />
            <FacetButton variant="contained" color="primary" type="submit" text="LOGIN" onClick={() => onLoginClick()}></FacetButton>
            <br />
            <FacetLink onClick={() => { onRegisterClick() }} color="#758EBF" underline="always" text="REGISTER" />
        </InnerStyledDiv>
    </StyledPopupDiv>

    return <StyledDiv>
        {element}
    </StyledDiv>
}