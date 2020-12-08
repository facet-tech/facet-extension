import React from 'react';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link } from '@material-ui/core';


export default ({ text, fontSize = "small", underline = 'always', color = '#8B8E93', onClick }) => {
    return <Typography display="inline" style={{ fontSize }}>
        <Link underline={underline} style={{ color }} href="#" onClick={() => onClick()}>{text}</Link>
    </Typography>
}