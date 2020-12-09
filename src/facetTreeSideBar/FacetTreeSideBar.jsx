import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import $ from 'jquery';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SaveIcon from '@material-ui/icons/Save';
import { defaultFacet, styles } from '../shared/constant';
import StyledTreeItem from './StyledTreeItem';
import parsePath from '../shared/parsePath';
import AppContext from '../AppContext';
import { color } from '../shared/constant.js';
import facetTypography from '../static/images/facet_typography.svg';
import FacetImage from '../shared/FacetImage';
import settingsLogo from '../static/images/facet_settings.svg';
import logoutLogo from '../static/images/logout_new.svg';
import facetProfileLogo from '../static/images/facet_profile.svg';
import facetEnableLogo from '../static/images/facet_button.svg';
import resetLogo from '../static/images/facet_restart_button.svg';
import saveFacetLogo from '../static/images/facet_save.svg';
import copySnippetLogo from '../static/images/facet_copy_snippet_button.svg';
import styled from 'styled-components';
import FacetIconButton from '../shared/FacetIconButton/FacetIconButton';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: styles.drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: styles.drawerWidth,
    backgroundColor: color.darkGray,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
  treeView: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
  margin: {
    marginRight: 20,
  },
  saveBtn: {
    position: 'absolute',
    bottom: 0,
  },
  centered: {
    textAlign: 'center',
  },
  logo: {
    width: '50%',
  },
  gridDiv: {
    display: 'grid',
    marginLeft: '.5rem',
    marginRight: '.5rem',
    marginTop: '.5rem'
  },
  fabGrid: {
    display: 'grid',
    alignItems: 'end',
    justifyContent: 'end',
    margin: '1rem'
  },
  fabBtn: {
    backgroundColor: color.lightGray,
    // '&:hover': {
    //   backgroundColor: color.darkGray,
    //   boxShadow: 'none',
    // },
    // '&:active': {
    //   boxShadow: 'none',
    // },
    // '&:focus': {
    //   backgroundColor: color.darkGray,
    // },
  }
}));

const TopDiv = styled.div`
    display: grid;
    grid-template-columns: 50% 10% 10% 10%;
    grid-gap: 5%;
`;

export default function FacetTreeSideBar() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const {
    facetMap, setFacetMap, setSelectedFacet, loadingSideBar,
    showSideBar, setShowSideBar, reset, onSaveClick,
  } = useContext(AppContext);
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [renamingFacet, setRenamingFacet] = useState();
  const facetArray = Array.from(facetMap, ([name, value]) => ({ name, value }));
  useEffect(() => { setExpanded(['Facet-1']); }, []);

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
  };

  const onDeleteFacet = (facet) => {
    facet && facet.value && facet.value.forEach((domElement) => {
      onDeleteDOMElement(domElement.path);
    });
    facetMap.delete(facet.name);
    setFacetMap(new Map(facetMap));
    const keys = [...facetMap.keys()];
    if (keys.length > 0) {
      setSelectedFacet(keys[keys.length - 1]);
    } else {
      setSelectedFacet(defaultFacet);
    }
  };

  const sideBarHandler = () => {
    // window.highlightMode = showSideBar;
    setShowSideBar(!showSideBar);
    if (!showSideBar) {
      // TODO removeEventListeners
    }
  };

  const onDeleteDOMElement = (path) => {
    try {
      // TODO DOM-related stuff should be handled through highlighter
      const parsedPath = parsePath([path], false);
      const element = $(parsedPath[0])[0];
      element.style.setProperty('opacity', 'unset');
    } catch (e) {
      console.log('[ERROR] onDeleteElement', e);
    }
  };

  // TODO duplicate, re-use function from highlighter
  const onMouseEnterHandle = function (path) {
    $(path).css('outline', '5px ridge #c25d29');
    $(path).css('cursor', 'pointer');
  };

  // TODO duplicate, re-use function from highlighter
  const onMouseLeaveHandle = function (path) {
    $(path).css('outline', 'unset');
    $(path).css('cursor', 'unset');
  };

  const handleNodeIdToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleNodeIdsSelect = (event, nodeId) => {
    const fArray = Array.from(facetMap, ([name, value]) => ({ name, value }));
    if (fArray.find((e) => e.name === nodeId)) {
      setSelected([nodeId]);
      setSelectedFacet(nodeId);
      if (expanded.includes(nodeId)) {
        setExpanded([]);
      } else {
        setExpanded([nodeId]);
      }
    }
  };

  const itemsElement = loadingSideBar ? <h2>Loading...</h2>
    : facetArray.map((facet) => {
      const { value } = facet;
      return (
        <StyledTreeItem
          nodeId={facet.name}
          key={facet.name}
          labelText={`${facet.name}`}
          labelIcon={ChangeHistoryIcon}
          onDeleteItem={(e) => { onDeleteFacet(facet); }}
          onRenameItem={() => { setRenamingFacet(facet.name); }}
          onRenameCancelClick={() => setRenamingFacet(undefined)}
          onRenameSaveClick={(e) => {
            facetMap.set(e, facetMap.get(facet.name));
            facetMap.delete(facet.name);
            setFacetMap(new Map(facetMap));
          }}
          renamingFacet={renamingFacet === facet.name}
        >
          {value && value.map((domElement, index) => (
            <StyledTreeItem
              onMouseOver={() => onMouseEnterHandle(domElement.path)}
              onMouseLeave={() => onMouseLeaveHandle(domElement.path)}
              nodeId={`${facet.name}-element-${index + 1}`}
              key={`${facet.name}-element-${index + 1}`}
              labelText={domElement.name}
              labelIcon={WebAssetIcon}
              onDeleteItem={() => {
                // TODO move on individual function
                onDeleteDOMElement(domElement.path);
                let arr = facetMap.get(facet.name);
                arr = arr.filter((e) => e.name !== domElement.name);
                facetMap.set(facet.name, arr);
                setFacetMap(new Map(facetMap.set(facet.name, arr)));
              }}
            />
          ))}
        </StyledTreeItem>
      );
    });

  const activateDeactivateElement = showSideBar
    ? (
      <FacetIconButton src={facetEnableLogo} onClick={() => sideBarHandler()} title="Disable" size="small" aria-label="Disable" />
    ) : (
      <FacetIconButton src={facetEnableLogo} onClick={() => sideBarHandler()} size="small" aria-label="Enable" />
    );

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.gridDiv}>
          <TopDiv>
            <div>
              <FacetImage src={facetTypography} />
            </div>
            <div>
              <FacetIconButton src={facetProfileLogo} />
            </div>
            <div>
              <FacetIconButton src={settingsLogo} />
            </div>
            <div>
              <FacetIconButton onClick={() => { logout() }} src={logoutLogo} />
            </div>
          </TopDiv>
          <div className={classes.drawerHeader}>
            {activateDeactivateElement}
            <FacetIconButton onClick={() => { reset(); }} title="Reset" size="small" aria-label="Reset" src={resetLogo} />
            <FacetIconButton src={saveFacetLogo} onClick={() => { onSaveClick(); }} size="small" aria-label="add" />
            <FacetIconButton src={resetLogo} onClick={() => { }} size="small" color="secondary" aria-label="Save" />
          </div>
          <div>
            <h3 style={{ color: color.lightGray }}>My Facets</h3>
          </div>
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
        <div className={classes.fabGrid}>
          <Fab onClick={() => addFacet()} size='small' className={classes.fabBtn} aria-label="add">
            <AddIcon />
          </Fab>
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
    </div>
  );
}
