import React, { useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import AppContext from './AppContext';
import NestedGrid from './NestedGrid';
import styled from 'styled-components';
import FacetSwitch from './FacetSwitch';
import Divider from '@material-ui/core/Divider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import $ from 'jquery';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
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
    const { enqueueSnackbar } = useSnackbar();

    const onSaveClick = async () => {
        enqueueSnackbar(`Hooray ~ Configuration has been saved 🙌!`, { variant: "success" });

        const payload = {
            "site": "mene9", "facet": [{
                "name": "myfacet", "enabled": "false", "id": window.hiddenPaths
            }]
        };
        const url = "https://drdsebmbv2.execute-api.us-west-2.amazonaws.com/live/facet/mene9";
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    const reset = () => {
        window.hiddenPaths.forEach(element => {
            const domElement = $(element)[0];
            domElement.style.setProperty("background-color", "unset");
        });
        window.hiddenPaths = [];
        enqueueSnackbar(`Reset all facets.`, { variant: "success" });
    }

    const useStyles = makeStyles((theme) => ({
        divider: {
            // Theme Color, or use css color in quote
            border: '2px lightgray solid'
        },
    }));

    const sideBarHanlder = () => {
        window.highlightMode = showSideBar;
        setShowSideBar(!showSideBar);
        if (!showSideBar) {
            // TODO removeEventListeners
        }
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
            <StyledButton onClick={() => reset()}>{'Reset All'}</StyledButton>
            <FacetSwitch></FacetSwitch>
            <StyledButton>{'Preview 🚀'}</StyledButton>
            <StyledButton onClick={() => onSaveClick()}>{'Save'}</StyledButton>
        </GridDiv>
        <Divider light classes={{ root: classes.divider }} />
    </div>
}