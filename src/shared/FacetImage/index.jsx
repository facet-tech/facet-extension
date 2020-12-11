import React from 'react';
import styled from 'styled-components';
import { color } from '../constant';

const StyledImage = styled.img`
    pointer-events: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
`;

export default (props) => {
    return <StyledImage {...props} />
}
