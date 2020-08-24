import React, { useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import facetSrc from './static/images/facet_ninja_logo.png';
import AppContext from './AppContext';
import NestedGrid from './NestedGrid';
// TODO add divider
import Divider from '@material-ui/core/Divider';

export default function FacetButton() {

    const { showSideBar, setShowSideBar } = useContext(AppContext);
    return <div>
        <div className="sidenav">
            <Button style={{ width: '20rem' }} onClick={() => { window.highlightMode = showSideBar; setShowSideBar(!showSideBar) }}>
                <img width="10%" src={facetSrc}></img>
                {showSideBar ? 'facet.ninja | hide' : 'facet.ninja | display'}
            </Button>
            {showSideBar ? <NestedGrid /> : null}
        </div>
    </div>
}