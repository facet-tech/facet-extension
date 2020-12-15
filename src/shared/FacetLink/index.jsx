import React from 'react';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link } from '@material-ui/core';
import { color as colorConstant } from '../../shared/constant.js';

export default ({ text, fontSize = "small", underline = 'none', color = colorConstant.lightGray, onClick }) => {
    return <Typography display="inline" style={{ fontSize }}>
        <Link underline={underline} style={{ color }} href="#" onClick={() => onClick ? onClick() : {}}>{text}</Link>
    </Typography>
}