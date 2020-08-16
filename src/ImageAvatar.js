import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import pic from './static/images/facet_ninja_logo.png';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        textAlign: "center"
      },
}));

export default function ImageAvatar() {
    const classes = useStyles();

    return (
        <div className={classes.large}>
            <Avatar alt="Facet Ninja" src={pic} className={classes.large} />
        </div>
    );
}