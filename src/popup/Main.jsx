/* global chrome */

import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { useSnackbar } from 'notistack';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Auth } from 'aws-amplify';
import { getKeyFromLocalStorage, setKeyInLocalStorage, clearStorage } from '../shared/loadLocalStorage';
import {
  api, APIUrl, isPluginEnabled as isPluginEnabledConstant, authState as authStateConstant, color, fontSize, snackbar,
} from '../shared/constant';
import FacetSwitch from '../FacetSwitch';
import triggerDOMReload from '../shared/popup/triggerDOMReload';
import { createNewUser, deleteUser, getDomain } from '../services/facetApiService';
import AppContext from '../AppContext';
import facetLogo from '../static/images/facet_typography.svg';
import logoutLogo from '../static/images/facet_logout.svg';
import FacetImage from '../shared/FacetImage';
import settingsLogo from '../static/images/facet_settings.svg';
import IconButton from '@material-ui/core/IconButton';
import FacetLabel from '../shared/FacetLabel';
import FacetCard from '../shared/FacetCard/FacetCard';
import FacetInput from '../shared/FacetInput';
import FacetImageButton from '../shared/FacetImageButton/FacetImageButton';
import InviteIcon from '../static/images/facet_invite_person.svg';
import FacetIconButton from '../shared/FacetIconButton/FacetIconButton';
import FacetButton from '../shared/FacetButton';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 80% 10% 10%;
    align-items: center;
    justify-content: center;
`;

const GridDivTwoColumn = styled.div`
    display: grid;
    grid-template-columns: 75% 25%;
    align-items: center;
    justify-content: center;
`;

const TwoGridDiv = styled.div`
    display: grid;
    grid-template-columns: 60% 30%;
    grid-gap: 5%;
    align-items: center;
`;

const TopDiv = styled.div`
  padding: 1rem;
`;

const MarginTop = styled.div`
    margin-top: ${(props) => props.value};
`;

const CenteredDiv = styled.div`
text-align: center;
`;

const PaddingDiv = styled.div`
padding: 1rem;
`;

export default () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    setJwt, url, isPluginEnabled, setIsPluginEnabled, setCurrAuthState, setUrl
  } = useContext(AppContext);
  const [invitee, setInvitee] = useState('');
  const [textToCopy, setTextToCopy] = useState(`<script src="${APIUrl.apiBaseURL}/facet.ninja.js?id={ID}"></script>`);

  const logout = () => {
    clearStorage();
    Auth.signOut();
    setCurrAuthState(authStateConstant.signingIn);
    setJwt(undefined);
    triggerDOMReload();
  };

  const onEnablePluginCB = async (e) => {
    chrome?.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { [isPluginEnabledConstant]: e }, async () => {
        setKeyInLocalStorage(isPluginEnabledConstant, e);
        const isPluginEnabledValue = await getKeyFromLocalStorage(isPluginEnabledConstant);
        setKeyInLocalStorage(isPluginEnabledConstant, isPluginEnabledValue);
        setIsPluginEnabled(isPluginEnabledValue);
      });
    });
    setKeyInLocalStorage(isPluginEnabledConstant, e);
    setIsPluginEnabled(e);
  };

  const loadCopySnippet = async () => {
    try {
      const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
      chrome?.tabs?.query({ active: true, currentWindow: true }, async function (tabs) {
        var currentTab = tabs[0]; // there will be only one in this array
        const loc = new URL(currentTab.url);
        const domainRes = await getDomain(loc.hostname, workspaceId);
        setUrl(loc.hostname);
        const text = `<script src="${APIUrl.apiBaseURL}/facet.ninja.js?id=${domainRes.response.id}"></script>`;
        setTextToCopy(text);
      });
    } catch (e) {
      console.log('[ERROR][loadCopySnippet]', e);
    }
  };

  useEffect(() => {
    loadCopySnippet();
  }, [url, setTextToCopy]);

  console.log('URL', url);

  return (
    <TopDiv>
      <GridDiv>
        <div>
          <FacetImage title="facet" href="https://facet.ninja/" src={facetLogo} />
        </div>
        <div>
          <FacetIconButton title="info" name="info-outline" onClick={() => {
            chrome.runtime.sendMessage({ data: ChromeRequestType.OPEN_WELCOME_PAGE });
          }} />
        </div>
        <div>
          <FacetIconButton title="logout" onClick={() => { logout() }} name="log-out-outline" size="large" />
        </div>
      </GridDiv>
      <MarginTop value=".5rem" />
      <FacetButton text={`Whitelist ${url}`} />
      <MarginTop value=".5rem" />
      <GridDivTwoColumn>
        <div>
          <FacetLabel fontSize={fontSize.large} color={color.ice} text="Enable Plugin" />
        </div>
        <div>
          <FacetSwitch labelOn="On" labelOff="Off" callBack={onEnablePluginCB} value={isPluginEnabled} />
        </div>
      </GridDivTwoColumn>
    </TopDiv>
  );
};
