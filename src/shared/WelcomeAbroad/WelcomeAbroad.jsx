import React from 'react';
import styled from 'styled-components';
import { color, fontSize } from '../constant';
import FacetFormContainer from '../FacetFormContainer';
import FacetIconButton from '../FacetIconButton/FacetIconButton';
import FacetLabel from '../FacetLabel';
import FacetLink from '../FacetLink';
import MarginTop from '../MarginTop';

const CenteredDiv = styled.div`
    text-align: center
`;

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: 5% 20%;
    grid-gap: 1rem;
    align-items: center;
    justify-content: center;
`;

export default () => {

    const onPlayVideoClick = () => {

    }

    const onTryNowClick = () => {

    }

    return <CenteredDiv>
        <FacetFormContainer>
            <FacetLabel fontSize={fontSize.xxLarge} color={color.ice} text="Welcome abroad!" />
            <MarginTop value='2rem' />
            <FacetLabel fontSize={fontSize.large} text="Welcome aboard!" />
            <MarginTop value='2rem' />
            <StyledDiv>
                <div>
                    <FacetIconButton onClick={() => { onPlayVideoClick() }} width='100%' name="play-circle-outline" />
                </div>
                <div>
                    <FacetLink onClick={() => { onPlayVideoClick() }} color={color.electricB} text="Watch tutorial" />
                </div>
            </StyledDiv>
            <br />
            <br />
            <StyledDiv>
                <div>
                    <FacetIconButton onClick={() => { onTryNowClick() }} width='100%' name="external-link-outline" />
                </div>
                <div>
                    <FacetLink onClick={() => { onTryNowClick() }} color={color.electricB} text="Try it now!" />
                </div>
            </StyledDiv>
            <br />
        </FacetFormContainer>
    </CenteredDiv>
}