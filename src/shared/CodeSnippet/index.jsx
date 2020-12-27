import React from 'react';
import styled from 'styled-components';
import { fontSize, color } from '../constant';
import FacetIconButton from '../FacetIconButton/FacetIconButton';
import FacetLabel from '../FacetLabel';

const StyledDiv = styled.div`
    padding: .1rem;
    display: grid;
    grid-template-columns: 90% 10%;
    margin: 1rem;
    border-radius: .5rem;
    align-items: center;
    justify-content: center;
    border: 1px solid ${color.ice};
    word-break: break-all;
`;

export default ({ text, onClick }) => {
    return <StyledDiv>
        <div style={{ userSelect: 'all', cursor: 'pointer', marginLeft: '.2rem' }} onClick={() => { }}>
            <FacetLabel color={color.ice} fontSize={fontSize.xSmall} text={text} />
        </div>
        <div style={{ alignSelf: 'start' }}>
            <FacetIconButton onClick={() => { if (onClick) { onClick() } }} customHeight=".8rem" name="clipboard" />
        </div>
    </StyledDiv >
}