import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CoreContext from '../CoreContext';
import AppContext from '../AppContext';
import parsePath from '../shared/parsePath';
import $, { map } from 'jquery';
import Button from '@material-ui/core/Button';
import { getKeyFromLocalStorage } from '../shared/loadLocalStorage';
import { saveFacets } from '../services/facetApiService';
import { api } from '../shared/constant';
import { computeWithOrWithoutFacetizer } from '../highlighter';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import StyledTreeItem from './StyledTreeItem';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import { getLastElementFromPath } from '../shared/parsePath';

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
    const [open, setOpen] = useState(true);
    let { hiddenPathsArr, setHiddenPathsArr, enqueueSnackbar, facetMap, setFacetMap, setSelectedFacet } = useContext(AppContext);
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const facetArray = Array.from(facetMap, ([name, value]) => ({ name, value }));

    console.log('check', facetMap);
    console.log('selected', selected);
    useEffect(() => {
        setExpanded(['Facet-1']);
    }, []);

    const addFacet = (autoNumber = facetMap.size + 1) => {
        const newName = `Facet-${autoNumber}`;
        if (facetMap.get(newName)) {
            addFacet(autoNumber + 1);
            return;
        }
        setFacetMap(facetMap.set(newName, []));
        setSelectedFacet(newName);
        setSelected(newName);
        setExpanded([newName]);
    }

    const onDeleteDOMElement = (path) => {
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

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        saveFacets(hiddenPathsArr, facetMap, enqueueSnackbar);
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
        setExpanded(nodeIds);
    };

    const handleNodeIdsSelect = (event, nodeId) => {
        if (facetArray.find(e => e.name === nodeId)) {
            setSelected(nodeId);
            setSelectedFacet(nodeId);
            setExpanded([nodeId]);
        }
    };

    const onDeleteFacet = (element) => {
        facetMap.delete(element.name);
        setFacetMap(new Map(facetMap));
    }

    const itemsElement = facetArray.map(element => {
        const value = element.value;
        return <StyledTreeItem
            nodeId={element.name}
            labelText={`${element.name}`}
            labelIcon={ChangeHistoryIcon}
            onDeleteItem={() => { onDeleteFacet(element) }}
        >
            {value.map((path, index) => {
                return <StyledTreeItem
                    onMouseOver={() => onMouseEnterHandle(path)}
                    onMouseLeave={() => onMouseLeaveHandle(path)}
                    nodeId={`${element.name}-element-${index + 1}`}
                    labelText={`element-${getLastElementFromPath(path)}`}
                    labelIcon={WebAssetIcon}
                    onDeleteItem={() => {
                        //onDeleteDOMElement
                        onDeleteDOMElement(path);
                        let arr = facetMap.get(element.name);
                        arr = arr.filter(e => e !== path);
                        facetMap.set(element.name, arr);
                        setFacetMap(new Map(facetMap.set(element.name, arr)));
                    }}
                />
            })}
        </StyledTreeItem>
    });

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
                expanded={expanded}
                selected={selected}
                onNodeToggle={handleNodeIdToggle}
                onNodeSelect={handleNodeIdsSelect}
            >
                {itemsElement}
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