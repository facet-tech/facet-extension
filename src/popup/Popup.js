/*global chrome*/

import React, { useContext } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FacetSwitch from '../FacetSwitch';
import TextField from '@material-ui/core/TextField';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { useSnackbar } from 'notistack';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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
    const { enqueueSnackbar } = useSnackbar();
    const { shouldDisplayFacetizer, setShouldDisplayFacetizer, url } = useContext(PopupContext);

    const invite = () => {
        // TODO http call
        enqueueSnackbar(`Invite sent!`, { variant: "success" });
    }

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

    const textToCopy = `<script src="https://api.facet.ninja/js/aHR0cHM6Ly9teXdlYnNpdGUuZmFjZXQubmluamEv/facet.ninja.js"></script>`;

    const element = <div>
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
                <Button
                    style={{ width: '100%' }}
                    onClick={() => invite()}
                    startIcon={<ContactMailIcon />}
                    variant="contained"
                    color="primary"
                    size="small">Invite
                    </Button>
            </div>
        </GridDiv>
        <MarginTop />
        <CopyToClipboard text={textToCopy}
            onCopy={() => enqueueSnackbar(`Copied snippet`, { variant: "info" })}>
            <Button startIcon={<FileCopyIcon />} style={{ width: '100%' }} variant="contained"
                color="primary" size="small">Copy Snippet</Button>
        </CopyToClipboard>
    </div >;
    return <StyledDiv>
        {element}
    </StyledDiv>
}