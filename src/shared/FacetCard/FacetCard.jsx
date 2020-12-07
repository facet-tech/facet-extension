import React from 'react';
import styled from 'styled-components';
import { color } from '../constant';

const CustomDiv = styled.div`
    border-radius: .5rem;
    background-color: ${color.ice};
    padding: 1rem;
`;

export default ({ children }) => {
    return <CustomDiv>
        {children}
    </CustomDiv>
}