import { Button } from '@material-ui/core';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { color as colorConstant } from '../constant';

export default ({
    color = colorConstant.ice, backgroundColor = colorConstant.grayA,
    hoverColor = colorConstant.electricB, onClick, text, disabled, ...other }) => {

    const ColorButton = withStyles(() => ({
        root: {
            color: color,
            backgroundColor: backgroundColor,
            '&:hover': {
                backgroundColor: hoverColor,
            },
        },
    }))(Button);

    return <div>
        <ColorButton
            style={{ width: '100%' }}
            variant="contained"
            disabled={disabled}
            onClick={() => { onClick() }}
            variant="contained"
            {...other}>
            {text}
        </ColorButton>
    </div >
}