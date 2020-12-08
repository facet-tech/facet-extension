import { IconButton, makeStyles, withStyles } from '@material-ui/core';
import React from 'react';
import { color } from '../constant';
import FacetImage from '../FacetImage';

const useStyles = makeStyles(theme => ({
    customHoverFocus: {
        "&:hover, &.Mui-focusVisible": { backgroundColor: color.ice }
    }
}));


export default ({ src, children, ...other }) => {
    const classes = useStyles();

    return <IconButton className={classes.customHoverFocus}
        iconStyle={{}} color="primary" aria-label="settings" component="span" {...other}>
        <FacetImage src={src} />
        {children}
    </IconButton>
}