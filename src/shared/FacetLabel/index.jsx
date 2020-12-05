import { Input, InputAdornment, InputLabel } from '@material-ui/core';
import React from 'react';

export default ({ text }) => {
    return <span
        style={{
            width: '100%',
            color: '#4A4E59'
        }}
    >{text}</span>
}