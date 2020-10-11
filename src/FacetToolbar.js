import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import AppContext from './AppContext';
import styled from 'styled-components';
import FacetSwitch from './FacetSwitch';
import Divider from '@material-ui/core/Divider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import $ from 'jquery';
import parsePath from './shared/parsePath';
import { HTTPMethods } from './shared/constant';
import { getKeyFromLocalStorage } from './shared/loadLocalStorage';
import { api } from './shared/constant';
import { createDomain, getOrPostDomain, triggerApiCall, deleteFacet } from './services/facetApiService';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 33% 33% 34%;
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
        color: 'white',
        fontSize: '1.5rem',
        width: '100%'
    },
    label: {
        textTransform: 'capitalize',
    },
})(Button);

export default function FacetToolbar() {
    const { enqueueSnackbar } = useSnackbar();

    const onSaveClick = async () => {
        try {
            // check if domain exists
            const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
            let getDomainRes = await getOrPostDomain(workspaceId);

            // TODO add this inside parse path
            const rightParsedPath = parsePath(window.hiddenPaths).map(el => el.replace(/ /g, ""));

            const body = {
                domainId: getDomainRes.id,
                domElement: [{
                    enabled: "true",
                    path: rightParsedPath
                }],
                urlPath: window.location.pathname
            }
            await triggerApiCall(HTTPMethods.POST, '/facet', body);
            enqueueSnackbar(`Hooray ~ Configuration has been saved 🙌!`, { variant: "success" });
            window.location.reload();
        } catch (e) {
            enqueueSnackbar(`Apologies, something went wrong. Please try again later.`, { variant: "error" });
        }

    }

    const reset = async () => {
        window.hiddenPaths.forEach(element => {
            const domElement = $(element)[0];
            if (!domElement) {
                return;
            }
            domElement.style.setProperty("opacity", "unset");
        });
        window.hiddenPaths = [];
        const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
        let domainRes = await getOrPostDomain(workspaceId);

        const body = {
            domainId: domainRes.id,
            domElement: [],
            urlPath: window.location.pathname
        }
        // deleteFacet(body);
        enqueueSnackbar(`Reset all facets.`, { variant: "success" });
        await triggerApiCall(HTTPMethods.POST, '/facet', body);
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

    const cb = (e) => {
        setShouldDisplayFacetizer(e);
    };

    const classes = useStyles();
    const { showSideBar, setShowSideBar, setShouldDisplayFacetizer } = useContext(AppContext);
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
            <StyledButton onClick={() => onSaveClick()}>{'Save'}</StyledButton>
        </GridDiv>
        <Divider light classes={{ root: classes.divider }} />
    </div>
}