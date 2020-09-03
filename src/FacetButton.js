import React, { useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import AppContext from './AppContext';
import NestedGrid from './NestedGrid';
import styled from 'styled-components';
import FacetSwitch from './FacetSwitch';
import Divider from '@material-ui/core/Divider';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 60% 20% 20%;
    background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 10%);
    color: white;
`;
const StyledDiv = styled.div`
    width: 100%;
    color: white;
`;

const StyledButton = withStyles({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white'
    },
    label: {
        textTransform: 'capitalize',
    },
})(Button);

export default function FacetButton() {

    const useStyles = makeStyles((theme) => ({
        divider: {
            // Theme Color, or use css color in quote
            border: '2px lightgray solid'
        },
    }));

    const sideBarHanlder = () => {
        window.highlightMode = showSideBar;
        setShowSideBar(!showSideBar);
    }

    const classes = useStyles();

    const { showSideBar, setShowSideBar } = useContext(AppContext);

    return <div>
        <GridDiv>
            <StyledDiv>
                <StyledButton
                    variant="contained"
                    color="primary"
                    primary={true} onClick={() => sideBarHanlder()}>
                    {showSideBar ? '⚔ facet.ninja | DEACTIVATE' : '⚔ facet.ninja | ACTIVATE'}
                </StyledButton>
            </StyledDiv>
            <FacetSwitch></FacetSwitch>
            <StyledButton>{'Preview'}</StyledButton>
        </GridDiv>
        <Divider light classes={{ root: classes.divider }} />
    </div>
}