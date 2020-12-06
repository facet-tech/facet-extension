import { Input } from '@material-ui/core';
import React from 'react';

export default ({ type, name, id }) => {
    return <div>
        <Input
            id={id}
            type={type}
            name={name}
            style={{
                width: '100%',
                backgroundColor: '#4A4E59',
                color: 'white',
                padding: '.3rem',
            }}
            id="standard-adornment-weight"
            aria-describedby="standard-weight-helper-text"
            inputProps={{
                'aria-label': 'weight',
            }}
        />
    </div>
}