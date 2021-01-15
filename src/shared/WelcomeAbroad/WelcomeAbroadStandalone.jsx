import React, { useEffect } from 'react';
import styled from 'styled-components';
import { color, fontSize } from '../constant';
import FacetFormContainer from '../FacetFormContainer';
import FacetLabel from '../FacetLabel';
import FacetLink from '../FacetLink';
import MarginTop from '../MarginTop';
import * as eva from "eva-icons";

const OuterDiv = styled.div`
    display: grid;
    -webkit-box-align: center;
    place-items: center;
    background-color: rgb(24, 29, 38);
    height: 100%;
`;

const InnerDiv = styled.div`
    width: 100%;
    max-width: 30rem;
`;

const CenteredDiv = styled.div`
    text-align: center;
`;

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: 5% 20%;
    grid-gap: 1rem;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

export default () => {

    useEffect(() => {
        eva.replace();
    }, []);

    const onPlayVideoClick = () => {
        window.open("https://video.facet.ninja/mvp");
    }

    /**
     * Redirects to the originating page and closes current tab
     */
    const onTryNowClick = () => {
        chrome.tabs.getCurrent(function (tab) {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const redirectTabId = urlParams.get('redirectTabId');
            if (redirectTabId) {
                chrome?.tabs?.reload(parseInt(redirectTabId));
            }
            // todo uncomment
            chrome.tabs.remove(tab.id);
        });
    }

    return <OuterDiv>
        <InnerDiv>
            <CenteredDiv>
                <FacetFormContainer>
                    <FacetLabel fontSize={fontSize.xxLarge} color={color.ice} text="Welcome abroad!" />
                    <MarginTop value='2rem' />
                    <StyledDiv onClick={() => { onPlayVideoClick() }}>
                        <div>
                            <i
                                fill={color.electricB}
                                data-eva="play-circle-outline"
                                data-eva-hover="true"
                                data-eva-infinite="true"
                            />
                        </div>
                        <div>
                            <FacetLink color={color.electricB} text="Watch tutorial" />
                        </div>
                    </StyledDiv>
                    <br />
                    <br />
                    <StyledDiv onClick={() => { onTryNowClick() }}>
                        <div>
                            <i
                                fill={color.electricB}
                                data-eva="external-link-outline"
                                data-eva-hover="true"
                                data-eva-infinite="true"
                            />
                        </div>
                        <div>
                            <FacetLink color={color.electricB} text="Close window" />
                        </div>
                    </StyledDiv>
                    <br />
                </FacetFormContainer>
            </CenteredDiv>
        </InnerDiv>
    </OuterDiv>
}