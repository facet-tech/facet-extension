import React from 'react';
import styled from "styled-components";


const StyledDiv = styled.div`
    align-self: center;
    justify-self: center;
    background-color: #181D26;
    height: 100%;
    max-width: 35rem;
`;

export default ({ children }) => {
    return <StyledDiv >{children}</StyledDiv>;
}