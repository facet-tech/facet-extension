/*global chrome*/

import React, { useContext } from 'react';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import Authentication from './Authentication';
import Main from './Main';
import AmplifyAuthentication from './AmplifyAuthentication';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 45% 45%;
    grid-gap: 5%;
    align-items: center;
`;

const MarginTop = styled.div`
    margin-top: ${props => props.value};
`;

const StyledDiv = styled.div`
    width: 20rem;
`;

const StyledSpan = styled.span`
    font-size: .5rem;
    word-break: break-all;
`;

export default () => {
    const { enqueueSnackbar } = useSnackbar();
    const { isUserAuthenticated, setIsUserAuthenticated } = useContext(PopupContext);

    const element = !isUserAuthenticated ? <AmplifyAuthentication /> : <Main />;

    return <StyledDiv>
        {element}
    </StyledDiv>
}