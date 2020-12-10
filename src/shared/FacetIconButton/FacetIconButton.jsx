import { IconButton, makeStyles, withStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { color } from '../constant';
import FacetImage from '../FacetImage';

const useStyles = makeStyles(theme => ({
    customHoverFocus: {
        // "&:hover, &.Mui-focusVisible": { backgroundColor: color.ice }
    }
}));

export default ({ src, hoverSrc, children, ...other }) => {
    const [activeSrc, setActiveSrc] = useState(src);
    const classes = useStyles();

    const onMouseOver = () => {
        if (hoverSrc) {
            setActiveSrc(hoverSrc);
        }
    }

    const onMouseOut = () => {
        setActiveSrc(src);
    }

    return <IconButton
        {...other}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        className={classes.customHoverFocus}
        iconStyle={{}} color="primary" aria-label="settings"
        component="span"><FacetImage src={activeSrc} />
        {children}
    </IconButton>
}