import { IconButton, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import * as eva from "eva-icons";
import { color } from '../constant';

const useStyles = makeStyles({
    iconButton: {
        padding: '.25rem',
        display: 'grid',
        backgroundColor: props => props.isSelected ? color.ice : '',
        "&:hover": {
            backgroundColor: color.ice,
            borderRadius: '50%',
        }
    },
    i: {
        display: 'grid'
    }
});

export default ({ name = "log-out-outline", size = "small", fill = color.lightGray, isSelected = false, children, ...other }) => {
    const classes = useStyles({ isSelected });

    useEffect(() => {
        eva.replace();
    }, []);

    return <IconButton
        {...other}
        className={classes.iconButton}>
        <i
            className={classes.i}
            fill={fill}
            data-eva={name}
            data-eva-hover="true"
            data-eva-infinite="true"
            data-eva-size={"small"}
        />
        {children}
    </IconButton>
}