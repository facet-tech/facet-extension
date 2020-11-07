import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import HighlightIcon from '@material-ui/icons/Highlight';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import CoreContext from '../CoreContext';
import AppContext from '../AppContext';
import parsePath from '../shared/parsePath';
import $ from 'jquery';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }
}));

export default function FacetTreeSideBar() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const { hiddenPathsArr } = useContext(AppContext);
    const { highlightedFacets, setHighlightedFacets } = useContext(CoreContext);

    const onFocusClick = (path) => {
        const parsedPath = parsePath([path], false);
        const element = $(parsedPath[0])[0];
        element.classList.add("rainbow");
        setHighlightedFacets([...setHighlightedFacets, parsedPath[0]]);
    }

    const onUnfocusClick = (path) => {
        const parsedPath = parsePath([path], false);
        const element = $(parsedPath[0])[0];
        element.classList.add("rainbow");
        setHighlightedFacets(highlightedFacets.filter(element => element !== path));
    }

    const onShowElement = (path) => {
        const parsedPath = parsePath([path], false);
        const element = $(parsedPath[0])[0];
        element.style.setProperty("opacity", "unset");
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (<div className={classes.root}>
        <CssBaseline />
        <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
        >
            <MenuIcon />
        </IconButton>
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                {'Available Facets'}
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            <List>
                {hiddenPathsArr.length > 0 ? hiddenPathsArr.map((path, index) => {
                    const fName = `facet-${index + 1}`;
                    return (
                        <ListItem key={fName}>
                            <TextField
                                id="filled-read-only-input"
                                defaultValue={fName}
                                variant="filled"
                            />
                            <IconButton onClick={() => onFocusClick(path)}>
                                <HighlightIcon className={classes.icon} />
                            </IconButton>
                            <IconButton onClick={() => onShowElement(path)}>
                                <RemoveRedEyeIcon className={classes.icon} />
                            </IconButton>
                        </ListItem>
                    )
                }) : "No facets found."}
            </List>
        </Drawer>
        <main
            className={clsx(classes.content, {
                [classes.contentShift]: open,
            })}>
            <div className={classes.drawerHeader} />
        </main>
    </div>
    );
}