import { IconButton, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import * as eva from "eva-icons";
import { color } from '../constant';

const useStyles = makeStyles({
    iconButton: {
        padding: '.25rem',
        display: 'grid',
        textAlign: 'center',
        width: props => props.width ? props.width : '',
    },
    i: {
        display: 'grid',
        fill: props => props.isSelected ? color.electricB : '',
        "&:hover": {
            fill: color.ice
        }
    }
});

export default ({ name, size = "xsmall", fill = color.lightGray,
    isSelected = false, customHeight, width, children, ...other }) => {
    const classes = useStyles({ isSelected, width });
    useEffect(() => {
        eva.replace();
    }, [name]);

    return <IconButton
        {...other}
        size="small"
        className={classes.iconButton}>
        <i
            style={{
                height: customHeight ? customHeight : ''
            }}
            className={classes.i}
            fill={fill}
            data-eva={name}
            data-eva-hover="true"
        />
        {children}
    </IconButton>
}