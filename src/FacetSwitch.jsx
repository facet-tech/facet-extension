/*global chrome*/

import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';
import { color } from './shared/constant';
import { withStyles } from '@material-ui/core';

const StyledDiv = styled.div`
    width: 100%;
    color: white;
`;

const CustomSwitch = withStyles({
    switchBase: {
      color: color.ice,
      '&$checked': {
        color: color.ice,
      },
      '&$checked + $track': {
        backgroundColor: color.ice,
      },
    },
    checked: {},
    track: {},
  })(Switch);

function FacetSwitch({ labelOn = 'Navigate', labelOff = 'Edit', callBack, value }) {
    const handleChange = () => {
        callBack(!value);
    };    

    return (
        <StyledDiv>
            <Grid
                style={{ height: '100%' }}
                justify="center"
                container>
                <FormControlLabel
                    control={
                        <CustomSwitch
                            checked={value}
                            onChange={() => handleChange()} />
                    }
                    label={value ? labelOn : labelOff}
                />
            </Grid>
        </StyledDiv >
    );
}

export default FacetSwitch;