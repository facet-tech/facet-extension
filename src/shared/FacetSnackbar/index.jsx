import React, { useState } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar, SnackbarContent } from 'notistack';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { color, fontSize, snackbar as snackbarConstants } from '../constant';
import FacetLabel from '../FacetLabel';
import Icon from 'react-eva-icons';

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            minWidth: '344px !important',
        },
        padding: '1rem',
        marginLeft: '16rem'
    },
    card: {
        display: 'grid',
        backgroundColor: color.darkGray,
        width: '100%',
        height: '3rem',
        borderRadius: '2rem',
        gridTemplateColumns: '15% 85%',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #FFFFFF',
        marginTop: '-2.5rem'
    },
    icon: {
        textAlign: 'center'
    },
}));

const FacetSnackbar = React.forwardRef((props, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);

    const handleDismiss = () => {
        closeSnackbar(props.id);
    };
    const { variant, message } = props;
    return (
        <SnackbarContent ref={ref} className={classes.root}>
            <Card className={classes.card}>
                <div className={classes.icon}>
                    <Icon
                        name={snackbarConstants[variant]['iconName']}
                        size='large'
                        fill={snackbarConstants[variant]['fill']}
                    />
                </div>
                <div>
                    <FacetLabel fontSize={fontSize.medium} color={color.white} text={message} />
                </div>
            </Card>
        </SnackbarContent>
    );
});

export default FacetSnackbar;