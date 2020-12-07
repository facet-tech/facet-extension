import React from 'react';
import styled from 'styled-components';

const StyledImage = styled.img`
    pointer-events: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
`;

export default (props) => {
    return <StyledImage {...props} />
}
