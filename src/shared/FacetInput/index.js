import { Input, withStyles } from '@material-ui/core';
import React from 'react';
import { color } from '../constant';

const CustomInput = withStyles(
    {
        focused: {},
        disabled: {},
        error: {},
        underline: {
            '&:before': {
                borderBottom: 'none'
            },
            '&:after': {
                borderBottom: `2px solid ${color.ice}`
            },
            '&:hover:not($disabled):not($focused):not($error):before': {
                borderBottom: `2px solid ${color.ice}`
            }
        }
    }
)(Input);

export default ({ type, name, id, ...other }) => {
    return <div>
        <CustomInput
            id={id}
            type={type}
            name={name}
            style={{
                width: '100%',
                backgroundColor: '#4A4E59',
                color: 'white',
                padding: '.3rem',
                borderRadius: '.5rem'
            }}
            id="standard-adornment-weight"
            aria-describedby="standard-weight-helper-text"
            inputProps={{
                'aria-label': 'weight',
            }}
            {...other}
        />
    </div>
}