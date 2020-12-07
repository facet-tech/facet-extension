import React from 'react';
import styled from 'styled-components';
import { color, fontSize } from '../constant';
import FacetFormContainer from '../FacetFormContainer';
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
            <FacetLabel text="Congratulations! You are part of our community from now on." />
            <br />
            <FacetLabel text="Get started with the following material:" />
            <br />
            <br />
            <b>
                <FacetLink color={color.electricB} text="Watch tutorial" />
            </b>
            <br />
            <br />
            <b>
                <FacetLink color={color.electricB} text="Test Drive facet-extension" />
            </b>
            <br />
            <br />
            <b>
                <FacetLink color={color.electricB} text="My profile" />
            </b>
        </FacetFormContainer>
    </CenteredDiv>
}