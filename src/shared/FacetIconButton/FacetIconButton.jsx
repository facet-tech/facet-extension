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
            fill: props => props.hoverColor,
        }
    }
});

export default ({ name, size = "small", fill = color.lightGray, hoverColor = color.ice,
    isSelected = false, customHeight, width, iconWidth, iconHeight, children, ...other }) => {
    const classes = useStyles({ isSelected, width, hoverColor });
    useEffect(() => {
        eva.replace();
    }, [name]);

    return <IconButton
        {...other}
        className={classes.iconButton}>
        <i
            style={{
                height: customHeight ? customHeight : ''
            }}
            className={classes.i}
            fill={fill}
            data-eva={name}
            data-eva-hover="true"
            data-eva-height={iconHeight ? iconHeight : '24'}
            data-eva-width={iconWidth ? iconWidth : '24'}
        />
        {children}
    </IconButton>
}