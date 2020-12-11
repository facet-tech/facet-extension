import { IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import FacetImage from '../FacetImage';

export default ({ src, hoverSrc, children, ...other }) => {
    const [activeSrc, setActiveSrc] = useState(src);

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
        iconStyle={{}} color="primary" aria-label="settings"
        component="span"><FacetImage src={activeSrc} />
        {children}
    </IconButton>
}