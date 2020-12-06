import React from 'react';
import { Link } from '@material-ui/core';

export default ({text, onClick}) => {
    return <Link style={{ color: '#758EBF' }} href="#" onClick={() => onClick()}>
        {text}
    </Link>
}