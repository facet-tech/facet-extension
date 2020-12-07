import { Icon } from '@material-ui/core';
import React from 'react';
import FacetButton from '../FacetButton';
import FacetImage from '../FacetImage';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InviteIcon from '../../static/images/facet_invite_person.svg';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    imageIcon: {
        height: '100%'
    },
    iconRoot: {
        textAlign: 'center'
    }
});

export default ({ text, startIconSrc, ...props }) => {
    const classes = useStyles();
    return <FacetButton
        onClick={() => invite()}
        startIcon={
            <Icon classes={{ root: classes.iconRoot }}>
                <img className={classes.imageIcon} src={startIconSrc} />
            </Icon>
        }
        variant="contained"
        size="small"
        text="Invite"
    >

    </FacetButton>
}