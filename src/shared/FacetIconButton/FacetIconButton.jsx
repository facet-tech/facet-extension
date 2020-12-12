import { IconButton } from '@material-ui/core';
import React from 'react';
import Icon from 'react-eva-icons';
import { color } from '../constant';

export default ({ name = "log-out-outline", size = "large", fill = color.lightGray, children, ...other }) => {

    return <IconButton
        {...other}
        iconStyle={{}} color="primary" aria-label="settings"
        component="span">
        <Icon
            name={name}
            size={size}
            fill={fill}
        />
        {children}
    </IconButton>
}