/* global chrome */

import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getKeyFromLocalStorage, setKeyInLocalStorage } from '../shared/loadLocalStorage';
import {
  api, APIUrl, isPluginEnabled as isPluginEnabledConstant, authState as authStateConstant, color, fontSize, snackbar, LoginTypes, ChromeRequestType,
} from '../shared/constant';
import FacetSwitch from '../FacetSwitch';
import triggerDOMReload from '../shared/popup/triggerDOMReload';
import { getDomain, hasWhitelistedDomain, addWhiteListedDomain, removeWhitelistedDomain, getOrPostDomain } from '../services/facetApiService';
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

export default () => {
  const { url, setUrl, isPluginEnabled, setIsPluginEnabled, logout } = useContext(AppContext);
  const [hasWhitelistedDomainVal, setHasWhitelistedDomainVal] = useState(isDevelopment ? true : false);
  const [loading, setLoading] = useState(true);

  const onEnablePluginCB = async (e) => {
    chrome?.tabs?.query({ active: true, currentWindow: true }, async (tabs) => {
      const urlOrigin = new URL(tabs[0].url).origin;
      await chrome.cookies.set({
        url: urlOrigin,
        name: `FACET_EXTENSION_DISABLE_MO`,
        value: Boolean(!isPluginEnabled).toString()
      });
      setLoading(true);

      chrome.tabs.sendMessage(tabs[0].id, { [isPluginEnabledConstant]: e }, async () => {
        setKeyInLocalStorage(isPluginEnabledConstant, e);
        const isPluginEnabledValue = await getKeyFromLocalStorage(isPluginEnabledConstant);
        setKeyInLocalStorage(isPluginEnabledConstant, isPluginEnabledValue);
        setIsPluginEnabled(isPluginEnabledValue);
        setLoading(false);
      });
      setKeyInLocalStorage(isPluginEnabledConstant, e);
      setIsPluginEnabled(e);
    });
  };

  useEffect(() => {
    setLoading(isDevelopment() ? false : true);
    async function loadState() {

      chrome?.tabs?.query({ active: true, currentWindow: true }, async function (tabs) {
        var currentTab = tabs[0]; // there will be only one in this array
        const loc = new URL(currentTab.url);
        setUrl(loc.hostname);
        const result = await hasWhitelistedDomain(loc.hostname);
        setHasWhitelistedDomainVal(result);
        setLoading(false);
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
    <FacetLabel text={`This domain (${url}) is included in the workspace. `} />
    <FacetLink color={color.electricB} onClick={() => { removeWhitelistUrl(url) }} text="Click here" />
    <FacetLabel text=" to remove it from the workspace." />
  </div> : <FacetButton onClick={() => { whiteListDomain(url) }} text={`Add domain to workspace`} />;

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
    <MarginTop value=".5rem" />
    <GridDivTwoColumn>
      <div>
        <FacetLabel fontSize={fontSize.large} color={color.ice} text="Enable Plugin" />
      </div>
      <div>
        <FacetSwitch labelOn="On" labelOff="Off" callBack={onEnablePluginCB} value={isPluginEnabled} />
      </div>
    </GridDivTwoColumn>
  </TopDiv>;
  return (
    loading ? loadingElement : coreElement
  );
};
