import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import AppContext from './AppContext';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import FacetTreeSideBar from './facetTreeSideBar/FacetTreeSideBar';

const StyledDiv = styled.div`
    width: ${props => props.drawer ? '100%' : '0'};
    color: white;
`;

export default function FacetToolbar() {
    const { facetMap } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    const useStyles = makeStyles((theme) => ({
        divider: {
            // Theme Color, or use css color in quote
            border: '2px lightgray solid'
        },
    }));

    const sideBarHandler = () => {
        // window.highlightMode = showSideBar;
        setShowSideBar(!showSideBar);
        if (!showSideBar) {
            // TODO removeEventListeners
        }
    }

    const classes = useStyles();
    const { showSideBar, setShowSideBar } = useContext(AppContext);
    return <div>
        <StyledDiv>
            <FacetTreeSideBar />
        </StyledDiv>
    </div>
}