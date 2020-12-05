import React from 'react';
import { Link } from '@material-ui/core';

export default ({ onClick, text }) => {

    return <span style={{ color: '#4A4E59' }} href="#" onClick={() => onClick()}>
        {text}
    </span>
}