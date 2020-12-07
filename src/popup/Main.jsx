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
  api, APIUrl, isPluginEnabled as isPluginEnabledConstant, authState as authStateConstant, color, fontSize,
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
import FacetButton from '../shared/FacetButton';
import FacetCard from '../shared/FacetCard/FacetCard';
import FacetInput from '../shared/FacetInput';
import FacetImageButton from '../shared/FacetImageButton/FacetImageButton';
import InviteIcon from '../static/images/facet_invite_person.svg';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 75% 12.5% 12.5%;
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

export default () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    setJwt, url, isPluginEnabled, setIsPluginEnabled, setCurrAuthState,
  } = useContext(AppContext);
  const [invitee, setInvitee] = useState('');
  const [textToCopy, setTextToCopy] = useState(`<script src="${APIUrl.apiBaseURL}/facet.ninja.js?id={ID}"></script>`);

  const logout = () => {
    clearStorage();
    Auth.signOut();
    setCurrAuthState(authStateConstant.signingIn);
    setJwt(undefined);
    window.close();
    triggerDOMReload();
  };

  const invite = async () => {
    // TODO http call
    const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
    deleteUser(invitee, workspaceId);
    createNewUser(invitee, workspaceId);

    enqueueSnackbar('Invite sent!', { variant: 'success' });
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

  const enableFacetizerElement = (
    <TopDiv>
      <GridDiv>
        <div>
          <FacetImage src={facetLogo} />
        </div>
        <div>
          <IconButton color="primary" aria-label="settings" component="span">
            <FacetImage src={settingsLogo} />
          </IconButton>
        </div>
        <div>
          <IconButton color="primary" aria-label="logout" component="span">
            <FacetImage src={logoutLogo} />
          </IconButton>
        </div>
      </GridDiv>
      <GridDivTwoColumn>
        <div>
          <FacetLabel color={color.ice} text="Enable Plugin" />
        </div>
        <div>
          <FacetSwitch labelOn="On" labelOff="Off" callBack={onEnablePluginCB} value={isPluginEnabled} />
        </div>
      </GridDivTwoColumn>
    </TopDiv>
  );

  const CenteredDiv = styled.div`
    text-align: center;
  `;

  const PaddingDiv = styled.div`
    padding: 1rem;
  `;

  const element = isPluginEnabled ? (
    <div>
      {enableFacetizerElement}
      <Divider />
      <MarginTop value=".5rem" />
      <Divider />
      <PaddingDiv>
        <FacetCard>
          <CenteredDiv>
            <FacetLabel fontSize={fontSize.medium} color={color.grayA} text="Send Invitation" />
          </CenteredDiv>
          <br />
          <TwoGridDiv>
            <div>
              <FacetInput onChange={(e) => { setInvitee(e.target.value) }} placeholder="invite@email.com" />
            </div>
            <div>
              <FacetImageButton onClick={() => invite()} color={color.ice} startIconSrc={InviteIcon} text="Invite" />
            </div>
          </TwoGridDiv>
        </FacetCard>
      </PaddingDiv>
      <Divider />
      <MarginTop value=".5rem" />
    </div>
  ) : enableFacetizerElement;
  return (
    <div>
      {element}
    </div>
  );
};
