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
import AppContext from '../AppContext';
import parsePath from '../shared/parsePath';
import $, { map } from 'jquery';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import StyledTreeItem from './StyledTreeItem';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import { getElementNameFromPath } from '../shared/parsePath';

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
        justifyContent: 'space-between'
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

    const onDeleteFacet = (facet) => {
        facet.value.forEach(domElement => {
            onDeleteDOMElement(domElement.path);
        })
        facetMap.delete(facet.name);
        setFacetMap(new Map(facetMap));
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
        setOpen(false);
    };

    // TODO duplicate, re-use function from highlighter
    const onMouseEnterHandle = function (path) {
        $(path).css("outline", "5px ridge #c25d29");
        $(path).css("cursor", "pointer");
    };

    // TODO duplicate, re-use function from highlighter
    const onMouseLeaveHandle = function (path) {
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

    const itemsElement = facetArray.map(facet => {
        const value = facet.value;
        return <StyledTreeItem
            nodeId={facet.name}
            labelText={`${facet.name}`}
            labelIcon={ChangeHistoryIcon}
            onDeleteItem={() => { onDeleteFacet(facet) }}
        >
            {value.map((domElement, index) => {
                return <StyledTreeItem
                    onMouseOver={() => onMouseEnterHandle(domElement.path)}
                    onMouseLeave={() => onMouseLeaveHandle(domElement.path)}
                    nodeId={`${facet.name}-element-${index + 1}`}
                    labelText={domElement.name}
                    labelIcon={WebAssetIcon}
                    onDeleteItem={() => {
                        onDeleteDOMElement(domElement.path);
                        let arr = facetMap.get(facet.name);
                        arr = arr.filter(e => e.name !== domElement.name);
                        facetMap.set(facet.name, arr);
                        setFacetMap(new Map(facetMap.set(facet.name, arr)));
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
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
                <h3>Facets</h3>
                <Fab onClick={() => { addFacet() }} size="small" color="secondary" aria-label="add" className={classes.margin}>
                    <AddIcon />
                </Fab>
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