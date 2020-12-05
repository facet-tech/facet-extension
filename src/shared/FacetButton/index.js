import { Button } from '@material-ui/core';
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green, purple } from '@material-ui/core/colors';

const ColorButton = withStyles((theme) => ({
    root: {
        color: '#4A4E59',
        backgroundColor: '#C4DDF2',
        '&:hover': {
            backgroundColor: '#758EBF',
        },
    },
}))(Button);

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default ({ onClick, text, disabled }) => {
    const classes = useStyles();

    return <div className={classes.root}>
        <ColorButton
            style={{ width: '100%' }}
            variant="contained"
            color="primary"
            disabled={disabled}
            className={classes.margin}
            onClick={() => { onClick() }}
            variant="contained"
            color="primary"
            size="small">
            {text}
        </ColorButton>
    </div >
}