import { IconButton, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import * as eva from "eva-icons";
import { color } from '../constant';

const useStyles = makeStyles({
    iconButton: {
        padding: '.25rem',
        display: 'grid',
        "&:hover": {
            // backgroundColor: color.ice,
            // borderRadius: '50%',
        }
    },
    i: {
        display: 'grid',
        fill: props => props.isSelected ? color.electricB : '',
        "&:hover": {
            fill: color.ice
            // backgroundColor: color.ice,
            // borderRadius: '50%',
        }
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