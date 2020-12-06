import React from 'react';
import { Link } from '@material-ui/core';

export default ({ text, onClick, underline = 'always' }) => {
    return <Link underline={underline} style={{ color: '#8B8E93' }} href="#" onClick={() => onClick()}>
        {text}
    </Link>
}