import React, { useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import AppContext from './AppContext';
import NestedGrid from './NestedGrid';
import styled from 'styled-components';

const StyledBtn = styled.div`
    display: unset;
`;

export default function FacetButton() {

    const sideBarHanlder = () => {
        window.highlightMode = showSideBar;
        setShowSideBar(!showSideBar);
    }

    const { showSideBar, setShowSideBar } = useContext(AppContext);

    return <div>
        <div>
            <Button style={{ textAlign: 'left', width: '100%' }} onClick={() => sideBarHanlder()}>
                {showSideBar ? 'facet.ninja | hide' : 'facet.ninja | display'}
            </Button>
            {showSideBar ? <NestedGrid /> : null}
        </div>
    </div>
}