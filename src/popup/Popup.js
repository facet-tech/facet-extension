/*global chrome*/

import React, { useContext, useEffect } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
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
    const { loggedInUser, setLoggedInUser } = useContext(PopupContext);
    const login = () => {
        chrome && chrome.identity && chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
            console.log('produced token', token);
        });
    }

    const logout = () => {
    }

    // loggedInUser, setLoggedInUser
    useEffect(() => {
        const getProfile = () => {
            // getProfileUserInfo
            chrome && chrome.identity && chrome.identity.getProfileUserInfo(undefined, function (rr) {
                console.log('IN USERPROFILEINFO', rr);
                setLoggedInUser(rr);
            });
        }
        getProfile();
    }, []);

    // 
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
                    <FacetSwitch labelOn='On' labelOff='Off' />
                </div>
            </GridDiv>
            <Button style={{ width: '100%' }} variant="contained" color="secondary" onClick={() => logout()}>Logout</Button>
        </div> : <Button variant="contained" color="secondary" onClick={() => login()}>
            Login </Button>;
    return <StyledDiv>
        {element}
    </StyledDiv>
}