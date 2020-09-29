/*global chrome*/

import React, { useContext, useEffect } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FacetSwitch from '../FacetSwitch';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: .5rem;
`;

const StyledDiv = styled.div`
    width: 20rem;
    height: 10rem;
`;

export default () => {

    const { loggedInUser, setLoggedInUser, setShouldDisplayFacetizer } = useContext(PopupContext);
    const login = () => {
        chrome && chrome.identity && chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
            console.log('produced token', token);
        });
    }

    const logout = () => { }

    useEffect(() => {

        const getProfile = () => {
            chrome && chrome.identity && chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
                console.log('produced token', token);
            });
            // getProfileUserInfo
            chrome && chrome.identity && chrome.identity.getProfileUserInfo(undefined, function (rr) {
                console.log('IN USERPROFILEINFO', rr);
                setLoggedInUser(rr);
            });
        }
        getProfile();
    }, []);

    const cb = (e) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 'showFacetizer': e }, function (response) {
                console.log('SENDING...', e)
            });
        });
        console.log('@popupCB', e);
        setShouldDisplayFacetizer(e);
    }

    const element = loggedInUser && loggedInUser.email ?
        <div>
            <Typography variant="h6" gutterBottom>
                {'email:'} {loggedInUser.email}
            </Typography>
            <GridDiv>
                <div>
                    <Typography variant="h6" gutterBottom>
                        {'Facetize: '}
                    </Typography>
                </div>
                <div>
                    <FacetSwitch labelOn='On' labelOff='Off' callBack={cb} />
                </div>
            </GridDiv>
            <Button style={{ width: '100%' }} variant="contained" color="secondary" onClick={() => logout()}>Logout</Button>
        </div> : <Button variant="contained" color="secondary" onClick={() => login()}>
            Login </Button>;
    return <StyledDiv>
        {element}
    </StyledDiv>
}