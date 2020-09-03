/*global chrome*/
import React, { Component, useContext } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';
import AppContext from './AppContext';

const StyledDiv = styled.div`
    width: 15rem;
`
// window.facetProvider = {
//     isEnabled, setIsEnabled
// }

function Popup() {
    // const { isEnabled, setIsEnabled } = useContext(AppContext);
    // console.log('CHECKE2!!', isEnabled);

    // console.log('isEnabled', isEnabled)
    const [isEnabled, setIsEnabled] = React.useState(true);

    const handleChange = () => {
        // setIsEnabled(!isEnabled);
        window.facetProvider.setIsEnabled(!window.facetProvider.isEnabled);
        setIsEnabled(!isEnabled);
        chrome.browserAction.onClicked.addListener(function (tab) {
            console.log('HEYY', tab);
            chrome.tabs.sendMessage(tab.id, { ldawdw: 'ela malaka' });
        });
    };

    return (
        <StyledDiv>
            <h2>Facet Mode:</h2>
            <FormGroup row>
                <FormControlLabel
                    control={<Switch checked={isEnabled} onChange={handleChange} />}
                    label={isEnabled ? "Turn Off" : "Turn On"}
                />
            </FormGroup>
        </StyledDiv >
    );
}

export default Popup;