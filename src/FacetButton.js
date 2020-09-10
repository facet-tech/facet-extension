import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import AppContext from './AppContext';
import styled from 'styled-components';
import FacetSwitch from './FacetSwitch';
import Divider from '@material-ui/core/Divider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import $ from 'jquery';
import { computeWithoutFacetizer } from './highlighter';

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

    const onPreviewClick = () => {
        enqueueSnackbar(`👷‍♂️⚒ Feature coming soon! 👷‍♂️⚒`, { variant: "info" });
    }

    const parsePath = (payload) => {
        var newPayload = [];
        for (var i = 0; i < payload.length; i++) {
            var secondParthWithoutFacetizer = computeWithoutFacetizer(payload[i]);
            var split1 = payload[i].split('>');
            split1[1] = secondParthWithoutFacetizer;
            newPayload.push(split1.join('>'));
        }
        return newPayload;
    }

    const onSaveClick = async () => {
        enqueueSnackbar(`Hooray ~ Configuration has been saved 🙌!`, { variant: "success" });
        // TODO fix this is buggy
        // const parsedPath = parsePath(window.hiddenPaths);
        const parsedPath = window.hiddenPaths;
        const payload = {
            "site": window.btoa(window.location.href), "facet": [{
                "name": "myfacet", "enabled": "false", "id": parsedPath
            }]
        };
        console.log('window.hiddenPaths', window.hiddenPaths);
        const url = `https://api.facet.ninja/facet/${window.btoa(window.location.href)}`;
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
            <StyledButton onClick={() => { onPreviewClick() }}>{'Preview 🚀'}</StyledButton>
            <StyledButton onClick={() => onSaveClick()}>{'Save'}</StyledButton>
        </GridDiv>
        <Divider light classes={{ root: classes.divider }} />
    </div>
}