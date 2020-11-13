/*global chrome*/

import React, { useContext, useEffect, useState } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FacetSwitch from '../FacetSwitch';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { useSnackbar } from 'notistack';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getKeyFromLocalStorage, setKeyInLocalStorage, clearStorage } from '../shared/loadLocalStorage';
import { deleteUser, getDomain, createNewUser } from '../services/facetApiService';
import { api, APIUrl } from '../shared/constant';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 30% 30% 30%;
    grid-gap: 5%;
    align-items: center;
    justify-content: center;
`;

const TwoGridDiv = styled.div`
    display: grid;
    grid-template-columns: 60% 30%;
    grid-gap: 5%;
    align-items: center;
    justify-content: center;
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
    const { setIsUserAuthenticated, shouldDisplayFacetizer, setShouldDisplayFacetizer, url, isPluginEnabled, setIsPluginEnabled } = useContext(PopupContext);
    const [invitee, setInvitee] = useState('');
    const [textToCopy, setTextToCopy] = useState(`<script src="${APIUrl.apiBaseURL}/facet.ninja.js?id={ID}"></script>`);
    const logout = () => {
        clearStorage();
        setIsUserAuthenticated(false);
    }

    const invite = async () => {
        // TODO http call
        const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
        deleteUser(invitee, workspaceId);
        createNewUser(invitee, workspaceId);

        enqueueSnackbar(`Invite sent!`, { variant: "success" });
    }

    const cb = (e) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 'showFacetizer': e }, async function (response) {
                const showFacetizerValue = await getKeyFromLocalStorage('showFacetizer');
                const isPluginEnabledValue = await getKeyFromLocalStorage('isPluginEnabled');
                setKeyInLocalStorage('showFacetizer', showFacetizerValue);
                setKeyInLocalStorage('isPluginEnabled', isPluginEnabledValue);
                setShouldDisplayFacetizer(showFacetizerValue);
                setIsPluginEnabled(isPluginEnabledValue);
            });
        });
        // updating chrome storage
        setKeyInLocalStorage('showFacetizer', e);
        setShouldDisplayFacetizer(e);
    }

    const onEnablePluginCB = (e) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 'isPluginEnabled': e }, async function (response) {
                setKeyInLocalStorage('isPluginEnabled', e);

                const showFacetizerValue = await getKeyFromLocalStorage('showFacetizer');
                const isPluginEnabledValue = await getKeyFromLocalStorage('isPluginEnabled');
                setKeyInLocalStorage('showFacetizer', showFacetizerValue);
                setKeyInLocalStorage('isPluginEnabled', isPluginEnabledValue);
                setShouldDisplayFacetizer(showFacetizerValue);
                setIsPluginEnabled(isPluginEnabledValue);
            });
        });
        // update storage
        setKeyInLocalStorage('isPluginEnabled', e);
        if (!e) {
            setKeyInLocalStorage('showFacetizer', e);
        }
        setIsPluginEnabled(e);
    }

    useEffect(async () => {
        try {
            const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
            var loc = new URL(url);
            let domainRes = await getDomain(loc.hostname, workspaceId);
            const text = `<script src="${APIUrl.apiBaseURL}/facet.ninja.js?id=${domainRes.response.id}"></script>`;
            setTextToCopy(text);
        } catch (e) {
            console.log('[ERROR]', e)
        }

    }, [url, setTextToCopy]);

    const enableFacetizerElement = <div>
        <GridDiv>
            <div>
                <Typography gutterBottom>
                    {'Enable Plugin:'}
                </Typography>
            </div>
            <div>
                <FacetSwitch labelOn='On' labelOff='Off' callBack={onEnablePluginCB} value={isPluginEnabled} />
            </div>
            <div>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => logout()}>
                    logout
                </Button>
            </div>
        </GridDiv>
    </div>;

    const element = isPluginEnabled ? <div>
        {enableFacetizerElement}
        <Divider />
        <MarginTop value=".5rem" />
        <TwoGridDiv>
            <div>
                <Typography variant="primary" gutterBottom>
                    {'Show Toolbar: (Ctrl+E)'}
                </Typography>
            </div>
            <div>
                <FacetSwitch labelOn='On' labelOff='Off' callBack={cb} value={shouldDisplayFacetizer} />
            </div>
        </TwoGridDiv>
        <Divider />
        <TwoGridDiv>
            <div>
                <TextField
                    onChange={(e) => { setInvitee(e.target.value) }}
                    id="outlined-basic"
                    variant="outlined" type='email'
                    placeholder="example@email.com"
                />
            </div>
            <div>
                <Button
                    style={{ width: '100%' }}
                    onClick={() => invite()}
                    startIcon={<ContactMailIcon />}
                    variant="contained"
                    color="primary"
                    size="small">Invite
                </Button>
            </div>
        </TwoGridDiv>
        <Divider />
        <MarginTop value=".5rem" />
        <CopyToClipboard text={textToCopy}
            onCopy={() => enqueueSnackbar(`Copied snippet`, { variant: "info" })}>
            <Button startIcon={<FileCopyIcon />} style={{ width: '100%' }} variant="contained"
                color="primary" size="small">Copy Snippet</Button>
        </CopyToClipboard>
    </div > : enableFacetizerElement;
    return <StyledDiv>
        {element}
    </StyledDiv>
}