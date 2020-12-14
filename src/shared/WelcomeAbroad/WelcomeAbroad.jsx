import React from 'react';
import styled from 'styled-components';
import { color, fontSize } from '../constant';
import FacetFormContainer from '../FacetFormContainer';
import FacetIconButton from '../FacetIconButton/FacetIconButton';
import FacetLabel from '../FacetLabel';
import FacetLink from '../FacetLink';

const CenteredDiv = styled.div`
    text-align: center
`;

export default () => {
    return <CenteredDiv>
        <FacetFormContainer>
            <FacetLabel fontSize={fontSize.xxLarge} color={color.ice} text="Welcome abroad!" />
            <br />
            <br />
            <FacetLabel text="Welcome aboard!" />
            <br />
            <br />
            <b>
                <FacetIconButton name="play-circle-outline" />
                <FacetLink color={color.electricB} text="Watch tutorial" />
            </b>
            <br />
            <br />
            <b>
                <FacetIconButton name="external-link-outline" />
                <FacetLink color={color.electricB} text="Try it now!" />
            </b>
            <br />
        </FacetFormContainer>
    </CenteredDiv>
}