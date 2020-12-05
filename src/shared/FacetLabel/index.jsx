import { Input, InputAdornment, InputLabel } from '@material-ui/core';
import React from 'react';

export default ({ text }) => {
    return <div>
        <InputLabel
            style={{
                width: '100%',
                color: '#4A4E59'
            }}
        >{text}</InputLabel>
    </div>
}