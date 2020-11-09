import React, { Fragment, useContext, useState } from 'react';
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
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CoreContext from '../CoreContext';
import AppContext from '../AppContext';
import parsePath from '../shared/parsePath';
import $, { map } from 'jquery';
import Button from '@material-ui/core/Button';
import { getKeyFromLocalStorage } from '../shared/loadLocalStorage';
import { getOrPostDomain, saveFacets } from '../services/facetApiService';
import { api } from '../shared/constant';
import { computeWithOrWithoutFacetizer } from '../highlighter';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const drawerWidth = 280;

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
    },
    treeView: {
        height: 216,
        flexGrow: 1,
        maxWidth: 400,
    },
    margin: {
        marginRight: 20
    },
    saveBtn: {
        position: 'absolute',
        bottom: 0
    }
}));

export default function FacetTreeSideBar() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    let { hiddenPathsArr, setHiddenPathsArr, enqueueSnackbar,
        facetMap, setFacetMap, selectedFacet, setSelectedFacet } = useContext(AppContext);
    const { highlightedFacets, setHighlightedFacets } = useContext(CoreContext);
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);

    console.log('CHECK FF', facetMap);

    const onFocusClick = (path) => {
        const parsedPath = parsePath([path], false);
        const element = $(parsedPath[0])[0];
        $(path).wrapAll("<div class='rainbow' />");
        setHighlightedFacets([...setHighlightedFacets, parsedPath[0]]);
    }

    const onUnfocusClick = (path) => {
        // TODO
    }

    const addFacet = () => {
        console.log('ADDFACET')
        const autoNumber = facetMap.size + 1;
        const newName = `Facet-${autoNumber}`;
        facetMap.set(newName, []);
        setSelectedFacet(newName);
        setSelected(newName);
    }

    const onDeleteElement = (path) => {
        try {
            const parsedPath = parsePath([path], false);
            const element = $(parsedPath[0])[0];
            element.style.setProperty("opacity", "unset");
            hiddenPathsArr = hiddenPathsArr.filter(e => e !== path);
            setHiddenPathsArr(hiddenPathsArr);
        } catch (e) {
            console.log(`[ERROR] onDeleteElement`, e);
        }
    }

    const onSaveClick = async () => {
        saveFacets(hiddenPathsArr, facetMap, enqueueSnackbar);
        setOpen(false);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const onMouseEnterHandle = function (path) {
        const computedPath = computeWithOrWithoutFacetizer(path, true);

        $(path).css("outline", "5px ridge #c25d29");
        $(path).css("cursor", "pointer");
    };

    const onMouseLeaveHandle = function (path) {
        const computedPath = computeWithOrWithoutFacetizer(path, true);

        $(path).css("outline", "unset");
        $(path).css("cursor", "unset");
    }

    const handleNodeIdToggle = (event, nodeIds) => {
        console.log('handleNodeIdToggle', handleNodeIdToggle)
        setExpanded(nodeIds);
    };

    const handleNodeIdsSelect = (event, nodeIds) => {
        console.log('@handleNodeIdsSelect', nodeIds)
        setSelected(nodeIds);
        setSelectedFacet(nodeIds);
    };

    const facetArray = Array.from(facetMap, ([name, value]) => ({ name, value }));
    const itemsElement = facetArray.map(element => {
        const value = element.value;
        return <TreeItem
            nodeId={element.name}
            label={element.name}>
            {value.map((path, index) => {
                return <TreeItem
                    onMouseOver={() => onMouseEnterHandle(path)}
                    onMouseLeave={() => onMouseLeaveHandle(path)}
                    nodeId={`${element.name}-element-${index + 1}`}
                    label={`element-${index + 1}`}
                />
            })}
        </TreeItem>
    });

    console.log('SELECTED', selected);

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
                <Fab onClick={() => { addFacet() }} size="small" color="secondary" aria-label="add" className={classes.margin}>
                    <AddIcon />
                </Fab>
                <h3>Available Facets</h3>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            <TreeView
                className={classes.treeView}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={selected ? expanded : false}
                selected={selected}
                onNodeToggle={handleNodeIdToggle}
                onNodeSelect={handleNodeIdsSelect}
            >
                {itemsElement}
                <ListItem className={classes.saveBtn}>
                    <Button style={{ width: '100%' }} variant="contained"
                        color="primary" size="small" onClick={() => onSaveClick()}>
                        Save
                    </Button>
                </ListItem>
            </TreeView>
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