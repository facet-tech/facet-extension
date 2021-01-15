import React from 'react';
import { Input, InputAdornment, InputLabel } from '@material-ui/core';
import styled from 'styled-components';

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: 80% 20%;
`;

export default ({ text, checked }) => {
    return <StyledDiv>
        <div>
            {text}
        </div>
        {checked ? <div>✔️</div> : null}
    </StyledDiv>
}