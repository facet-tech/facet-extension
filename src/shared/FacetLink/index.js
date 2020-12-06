import React from 'react';
import { Link } from '@material-ui/core';

export default ({ text, onClick, underline = 'always', color = '#8B8E93' }) => {
    return <Link underline={underline} style={{ color }} href="#" onClick={() => onClick()}>
        {text}
    </Link>
}