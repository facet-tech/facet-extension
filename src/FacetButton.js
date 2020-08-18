import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import facetSrc from './static/images/facet_ninja_logo.png';
import AppContext from './AppContext';

const StyledDiv = styled.div`
   background-color: rgb(242, 245, 247);
    line-height: 1;
    position: absolute;
    text-align: center;
    top: 33%;
    cursor: pointer;
    zIndex: 1001021121;
}
`;

const StyledBtn = styled(Button)`
  height: 50px;
  width: 50px;
`;

export default function FacetButton() {
    const { showSideBar, setShowSideBar } = useContext(AppContext);
    return <StyledDiv>
        <StyledBtn onClick={() => { window.highlightMode = showSideBar; setShowSideBar(!showSideBar) }}> <img width='100%' src={facetSrc}></img>{'>'}</StyledBtn>
    </StyledDiv>
}