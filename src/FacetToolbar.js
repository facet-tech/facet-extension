import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import AppContext from './AppContext';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import $ from 'jquery';
import { HTTPMethods } from './shared/constant';
import { getKeyFromLocalStorage } from './shared/loadLocalStorage';
import { api } from './shared/constant';
import { getOrPostDomain, triggerApiCall, saveFacets } from './services/facetApiService';
import FacetTreeSideBar from './facetTreeSideBar';

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 9% 30% 30% 30%;
    background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 10%);
    color: white;
    justify-items: center;
    align-items: center;
`;

const StyledDiv = styled.div`
    width: ${props => props.drawer ? '100%' : '0'};
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
    const { hiddenPathsArr, facetNameMap } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    const onSaveClick = async () => {
        try {
            saveFacets(hiddenPathsArr, facetNameMap, enqueueSnackbar);
            window.location.reload();
        } catch (e) {
            enqueueSnackbar(`Apologies, something went wrong. Please try again later.`, { variant: "error" });
            console.log(`[ERROR] [onSaveClick] `, e)
        }
    }

    const reset = async () => {
        try {
            hiddenPathsArr.forEach(element => {
                const domElement = $(element)[0];
                if (!domElement) {
                    return;
                }
                domElement.style.setProperty("opacity", "unset");
            });
            const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
            let domainRes = await getOrPostDomain(workspaceId);

            const body = {
                domainId: domainRes.response.id,
                urlPath: window.location.pathname
            }
            enqueueSnackbar(`Facets reset.`, { variant: "success" });
            await triggerApiCall(HTTPMethods.DELETE, '/facet', body);
            window.location.reload();
        } catch (e) {
            console.log('[ERROR]', e);
        }
    }

    const useStyles = makeStyles((theme) => ({
        divider: {
            // Theme Color, or use css color in quote
            border: '2px lightgray solid'
        },
    }));

    const sideBarHandler = () => {
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
                <FacetTreeSideBar />
            </StyledDiv>
            <StyledButton
                onClick={() => sideBarHandler()}>
                {showSideBar ? 'DEACTIVATE' : 'ACTIVATE'}
            </StyledButton>
            <StyledButton onClick={() => reset()}>{'Reset'}</StyledButton>
            <StyledButton onClick={() => onSaveClick()}>{'Save'}</StyledButton>
        </GridDiv>
        <Divider light classes={{ root: classes.divider }} />
    </div>
}