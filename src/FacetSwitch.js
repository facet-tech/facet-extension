/*global chrome*/
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';

const StyledDiv = styled.div`
    width: 100%;
    color: white;
`;

function FacetSwitch({ labelOn = 'Navigate', labelOff = 'Edit', defaultValue = true, callBack }) {
    const [isEnabled, setIsEnabled] = useState(defaultValue);

    // spits out true/false depending reflecting switch state
    const handleChange = (e) => {
        setIsEnabled(!isEnabled);
        callBack(!isEnabled);
    };

    return (
        <StyledDiv>
            <Grid
                style={{ height: '100%' }}
                justify="center"
                container>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isEnabled}
                            onChange={handleChange} />
                    }
                    label={isEnabled ? labelOn : labelOff}
                />
            </Grid>
        </StyledDiv >
    );
}

export default FacetSwitch;