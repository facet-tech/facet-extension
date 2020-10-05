/*global chrome*/

import React, { useContext } from 'react';
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
import loadLocalStorage, { getKeyFromLocalStorage, setKeyInLocalStorage } from '../shared/loadLocalStorage';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 45% 45%;
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
`;

export default () => {
    const { enqueueSnackbar } = useSnackbar();

    const { shouldDisplayFacetizer, setShouldDisplayFacetizer, url, isPluginEnabled, setIsPluginEnabled } = useContext(PopupContext);

    const invite = () => {
        // TODO http call
        enqueueSnackbar(`Invite sent!`, { variant: "success" });
    }

    const cb = (e) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 'showFacetizer': e }, async function (response) {
                // const showFacetizerValue = await getKeyFromLocalStorage('showFacetizer');
                // const isPluginEnabledValue = await getKeyFromLocalStorage('isPluginEnabled');
                const showFacetizerValue = await getKeyFromLocalStorage('showFacetizer');
                const isPluginEnabledValue = await getKeyFromLocalStorage('isPluginEnabled');
                // console.log('trigger1. showFacetizerValue', showFacetizerValue, 'isPluginEnabledValue', isPluginEnabledValue);
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
                // console.log('trigger2. showFacetizerValue', showFacetizerValue, 'isPluginEnabledValue', isPluginEnabledValue);
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

    const textToCopy = `<script src="https://api.facet.ninja/js/aHR0cHM6Ly9teXdlYnNpdGUuZmFjZXQubmluamEv/facet.ninja.js"></script>`;

    const enableFacetizerElement = <GridDiv>
        <div>
            <Typography gutterBottom>
                {'Enable Plugin:'}
            </Typography>
        </div>
        <div>
            <FacetSwitch labelOn='On' labelOff='Off' callBack={onEnablePluginCB} value={isPluginEnabled} />
        </div>
    </GridDiv>;

    const element = isPluginEnabled ? <div>
        {enableFacetizerElement}
        <Divider />
        <MarginTop value=".5rem" />
        <GridDiv>
            <div>
                <Typography variant="primary" gutterBottom>
                    {'URL:'}
                </Typography>
            </div>
            <div>
                <StyledSpan>{url}</StyledSpan>
            </div>
        </GridDiv>
        <GridDiv>
            <div>
                <Typography variant="primary" gutterBottom>
                    {'Show Toolbar: '}
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
        <MarginTop value="2rem" />
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