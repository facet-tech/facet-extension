/* global chrome */

import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import $ from 'jquery';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import { styles, ChromeRequestType } from '../shared/constant';
import StyledTreeItem from './StyledTreeItem';
import AppContext from '../AppContext';
import { color } from '../shared/constant.js';
import facetTypography from '../static/images/facet_typography.svg';
import FacetImage from '../shared/FacetImage';
import styled from 'styled-components';
import FacetIconButton from '../shared/FacetIconButton/FacetIconButton';
import Fab from '@material-ui/core/Fab';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FacetLabel from '../shared/FacetLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid'
  },
  drawer: {
    width: styles.drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    backgroundColor: color.darkGray,
    width: styles.drawerWidth,
    border: 'none',
    height: '90%'
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
    display: 'grid'
  },
  fabGrid: {
    display: 'grid',
    alignItems: 'end',
    justifyContent: 'end',
    margin: '1rem',
  },
  fabBtn: {
    color: color.ice,
    fill: color.ice,
    backgroundColor: color.darkGray,
    '&:hover': {
      backgroundColor: color.darkGray,
    },
  }
}));

const TopDiv = styled.div`
    display: grid;
    grid-template-columns: 70% 10% 10%;
    grid-gap: 5%;
    align-items: center;
    justify-content: center;
    margin-left: 1rem;
    margin-right: 1rem;
    margin-top: 1rem;
`;

export default function FacetTreeSideBar() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const {
    facetMap, setFacetMap, setSelectedFacet, loadingSideBar, logout,
    showSideBar, setShowSideBar, reset, onSaveClick, textToCopy, handleCloseMenuEl,
    facetLabelMenu, setFacetMenuLabel, selected, setSelected, onDeleteFacet,
    expanded, setExpanded, onDeleteDOMElement
  } = useContext(AppContext);
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

  const sideBarHandler = () => {
    setShowSideBar(!showSideBar);
    if (!showSideBar) {
      // TODO removeEventListeners
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

  const itemsElement = loadingSideBar ? <FacetLabel text="Loading..." />
    : facetArray.map((facet) => {
      const { value } = facet;

      return (
        <StyledTreeItem
          nodeId={facet.name}
          key={facet.name}
          labelText={`${facet.name}`}
          labelIcon={ChangeHistoryIcon}
          onRenameItem={() => {
            setRenamingFacet(facetLabelMenu);
            handleCloseMenuEl();
          }}
          onRenameCancelClick={() => setRenamingFacet(undefined)}
          onRenameSaveClick={(e) => {
            facetMap.set(e, facetMap.get(facet.name));
            facetMap.delete(facet.name);
            setFacetMap(new Map(facetMap));
            handleCloseMenuEl();
          }}
          renamingFacet={renamingFacet === facet.name}
          isFacet={true}
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
                // TODO is this needed?
                // TODO move on individual function
                console.log('triggaara!', domElement);
                onDeleteDOMElement(domElement.path);
                let arr = facetMap.get(facet.name);
                arr = arr.filter((e) => e.name !== domElement.name);
                facetMap.set(facet.name, arr);
                setFacetMap(new Map(facetMap.set(facet.name, arr)));
              }}
              isFacet={false}
            />
          ))}
        </StyledTreeItem>
      );
    });

  const activateDeactivateElement = showSideBar
    ? (
      <FacetIconButton isSelected={true} name="keypad-outline" onClick={() => sideBarHandler()} title="Disable" aria-label="Disable" />
    ) : (
      <FacetIconButton name="keypad-outline" onClick={() => sideBarHandler()} title="Enable" aria-label="Enable" />
    );

  return (
    <div className={classes.root}>
      <div>
        <Drawer
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
                <FacetIconButton name="info-outline" onClick={() => {
                  chrome.runtime.sendMessage({ data: ChromeRequestType.OPEN_WELCOME_PAGE });
                }} />
              </div>
              <div>
                <FacetIconButton onClick={() => { logout() }} name="log-out-outline" size="large" />
              </div>
            </TopDiv>
            <br />
            <Divider style={{ backgroundColor: color.lightGray }} />
            <div className={classes.drawerHeader}>
              {activateDeactivateElement}
              <FacetIconButton name="refresh-outline" onClick={() => { reset(); }} title="Reset" size="small" aria-label="Reset" />
              <FacetIconButton name="save-outline" onClick={() => { onSaveClick(); }} size="small" aria-label="add" />
              <CopyToClipboard text={textToCopy}>
                <FacetIconButton name="copy" onClick={() => { }} size="small" aria-label="Save" />
              </CopyToClipboard>
            </div>
          </div>
          <Divider />
          <TreeView
            className={classes.treeView}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
            selected={selected}
          >
            {itemsElement}
          </TreeView>
        </Drawer>
      </div>
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
