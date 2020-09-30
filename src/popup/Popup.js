/*global chrome*/

import React, { useContext, useEffect } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FacetSwitch from '../FacetSwitch';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 45% 45%;
    grid-gap: 5%;
    align-items: center;
    justify-content: center;
`;

const MarginTop = styled.div`
    margin-top: 2rem;
`;

const StyledDiv = styled.div`
    width: 20rem;
`;

const StyledSpan = styled.span`
    font-size: .5rem;
`;

export default () => {
    const { loggedInUser, setLoggedInUser, shouldDisplayFacetizer, setShouldDisplayFacetizer, url } = useContext(PopupContext);
    console.log('check ME @popup!', shouldDisplayFacetizer);
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
        // sending message down to background script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 'showFacetizer': e }, function (response) {
                console.log('SENDING...', e)
            });
        });
        // updating chrome storage
        const facetKey = 'facet-settings';
        chrome.storage.sync.set({
            [facetKey]: {
                enabled: e
            }
        }, function () {
            console.log('Value is set to:', e);
        });
        setShouldDisplayFacetizer(e);
    }

    //loggedInUser && loggedInUser.email
    const element = true ?
        <div>
            <Typography gutterBottom>
                {'email:'} {loggedInUser.email}
            </Typography>
            <Divider />
            <Typography gutterBottom>
                {'URL:'} <StyledSpan>{url}</StyledSpan>
            </Typography>
            <GridDiv>
                <div>
                    <Typography variant="primary" gutterBottom>
                        {'Facetize: '}
                    </Typography>
                </div>
                <div>
                    <FacetSwitch labelOn='On' labelOff='Off' callBack={cb} value={shouldDisplayFacetizer} />
                </div>

            </GridDiv>
            <GridDiv>
                <div>
                    <TextField id="outlined-basic" variant="outlined" type='email' placeholder="example@email.com" />
                </div>
                <div>
                    <Button style={{ width: '100%' }} variant="contained" color="primary">Invite</Button>
                </div>
            </GridDiv>
            <MarginTop />
            <Button style={{ width: '100%' }} variant="contained" color="primary" onClick={() => logout()}>Copy Snippet</Button>
            <MarginTop />
            <Button style={{ width: '100%' }} variant="contained" color="secondary" onClick={() => logout()}>Logout</Button>
            <MarginTop />
        </div> : <Button variant="contained" color="secondary" onClick={() => login()}>
            Login </Button>;
    return <StyledDiv>
        {element}
    </StyledDiv>
}