/* global chrome */

import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { Auth } from 'aws-amplify';
import { getKeyFromLocalStorage, setKeyInLocalStorage, clearStorage } from '../shared/loadLocalStorage';
import {
  api, APIUrl, isPluginEnabled as isPluginEnabledConstant, authState as authStateConstant, color, fontSize, snackbar, LoginTypes, ChromeRequestType,
} from '../shared/constant';
import FacetSwitch from '../FacetSwitch';
import triggerDOMReload from '../shared/popup/triggerDOMReload';
import { getDomain, hasWhitelistedDomain, addWhiteListedDomain, removeWhitelistedDomain } from '../services/facetApiService';
import AppContext from '../AppContext';
import facetLogo from '../static/images/facet_typography.svg';
import FacetImage from '../shared/FacetImage';
import FacetLabel from '../shared/FacetLabel';
import FacetIconButton from '../shared/FacetIconButton/FacetIconButton';
import FacetButton from '../shared/FacetButton';
import FacetLink from '../shared/FacetLink';
import isDevelopment from '../utils/isDevelopment';
import Loading from '../shared/Loading';

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
  const { setJwt, url, isPluginEnabled, setIsPluginEnabled, setCurrAuthState, setUrl, loading, setLoading, logout } = useContext(AppContext);
  const [textToCopy, setTextToCopy] = useState(`<script src="${APIUrl.apiBaseURL}/facet.ninja.js?id={ID}"></script>`);

  const [hasWhitelistedDomainVal, setHasWhitelistedDomainVal] = useState(isDevelopment ? true : false);

  console.log('LOADING', loading);

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

  useEffect(() => {
    setLoading(isDevelopment ? false : true);
    async function loadState() {
      chrome?.tabs?.query({ active: true, currentWindow: true }, async function (tabs) {
        var currentTab = tabs[0]; // there will be only one in this array
        const loc = new URL(currentTab.url);
        const result = await hasWhitelistedDomain(loc.hostname);
        setLoading(false);
        setHasWhitelistedDomainVal(result);
      });
    }
    loadState();
  }, [])

  const whiteListDomain = async (url) => {
    setLoading(true);
    await addWhiteListedDomain(url);
    setHasWhitelistedDomainVal(true);
    setLoading(false);
  }

  const removeWhitelistUrl = async (url) => {
    setLoading(true);
    await removeWhitelistedDomain(url);
    setHasWhitelistedDomainVal(false);
    setLoading(false);
    triggerDOMReload();
  }

  const btnElement = hasWhitelistedDomainVal ? <div>
    <FacetLabel text={`This domain (${url}) is whitelisted. `} />
    <FacetLink color={color.electricB} onClick={() => { removeWhitelistUrl(url) }} text="Click here" />
    <FacetLabel text=" to remove it from the whitelist." />
  </div> : <FacetButton onClick={() => { whiteListDomain(url) }} text={`Whitelist ${url}`} />;

  const loadingElement = <TopDiv>
    <GridDiv>
      <div>
        <FacetImage title="facet" href="https://facet.ninja/" src={facetLogo} />
      </div>
    </GridDiv>
    <MarginTop value=".5rem" />
    <Loading />
  </TopDiv>;

  const coreElement = <TopDiv>
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
    {btnElement}
    {hasWhitelistedDomainVal ? <>
      <MarginTop value=".5rem" />
      <GridDivTwoColumn>
        <div>
          <FacetLabel fontSize={fontSize.large} color={color.ice} text="Enable Plugin" />
        </div>
        <div>
          <FacetSwitch labelOn="On" labelOff="Off" callBack={onEnablePluginCB} value={isPluginEnabled} />
        </div>
      </GridDivTwoColumn>
    </> : null}
  </TopDiv>;

  return (
    loading ? loadingElement : coreElement
  );
};
