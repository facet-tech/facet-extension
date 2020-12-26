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
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import { styles, ChromeRequestType, snackbar, defaultFacetName } from '../shared/constant';
import StyledTreeItem from './StyledTreeItem';
import AppContext from '../AppContext';
import { color } from '../shared/constant.js';
import facetTypography from '../static/images/facet_typography.svg';
import FacetImage from '../shared/FacetImage';
import styled from 'styled-components';
import FacetIconButton from '../shared/FacetIconButton/FacetIconButton';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Loading from '../shared/Loading';
import facetLogo from '../static/images/facet_main_logo.svg'
import facetLogoIce from '../static/images/facet_ice_logo.svg';
import CodeSnippet from '../shared/CodeSnippet';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid'
  },
  drawer: {
    width: styles.drawerWidth,
    flexShrink: 0,
    overflow: 'overlay'
  },
  drawerPaper: {
    backgroundColor: color.darkGray,
    width: styles.drawerWidth,
    border: 'none',
    height: '90%',
    overflow: 'overlay'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0px 3rem',
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
  }
}));

const TopDiv = styled.div`
    display: grid;
    grid-template-columns: 60% 10% 10%;
    grid-gap: 5%;
    align-items: center;
    justify-content: center;
    margin-left: 1rem;
    margin-right: 1rem;
    margin-top: 1rem;
`;

export default function FacetTreeSideBar() {
  const classes = useStyles();
  const [open] = useState(true);
  const {
    facetMap, setFacetMap, loadingSideBar, logout,
    showSideBar, setShowSideBar, reset, onSaveClick, textToCopy, handleCloseMenuEl,
    facetLabelMenu, expanded, setExpanded, onDeleteDOMElement, enqueueSnackbar,
    setSelectedFacet, onGotoClick, nonRolledOutFacets, setNonRolledOutFacets } = useContext(AppContext);
  const [renamingFacet, setRenamingFacet] = useState(false);
  const facetArray = Array.from(facetMap, ([name, value]) => ({ name, value }));
  useEffect(() => { setExpanded([defaultFacetName]); }, []);

  const addFacet = (autoNumber = facetMap.size + 1) => {
    const newName = `Facet-${autoNumber}`;
    if (facetMap.get(newName)) {
      addFacet(autoNumber + 1);
      return;
    }
    setFacetMap(facetMap.set(newName, []));
    setSelectedFacet(newName);
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

  const itemsElement = loadingSideBar ?
    <div style={{ padding: '1rem' }}>
      <Loading />
    </div>
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
          onRenameCancelClick={() => {
            setRenamingFacet(false);
          }}
          onRenameSaveClick={(newFacetName) => {
            if (newFacetName === facet.name) {
              setRenamingFacet(false);
              return;
            }
            if (facetMap.has(newFacetName)) {
              enqueueSnackbar({
                message: `A facet already exists with this name. Please give your facet a unique name.`,
                variant: snackbar.error.text
              });
              return;
            }
            const newNonRolledOutFacets = nonRolledOutFacets.filter(e => e !== facet.name);
            newNonRolledOutFacets.push(newFacetName);
            setNonRolledOutFacets(newNonRolledOutFacets);
            facetMap.set(newFacetName, facetMap.get(facet.name));
            facetMap.delete(facet.name);
            setFacetMap(new Map(facetMap));
            setSelectedFacet(newFacetName);
          }}
          renamingFacet={renamingFacet === facet?.name}
          isFacet={true}
        >
          {value && value.map((domElement, index) => {
            return (
              <>
                <StyledTreeItem
                  onMouseOver={() => onMouseEnterHandle(domElement.path)}
                  onMouseLeave={() => onMouseLeaveHandle(domElement.path)}
                  nodeId={`${facet.name}-element-${index + 1}`}
                  key={`${facet.name}-element-${index + 1}`}
                  labelText={domElement.name}
                  labelIcon={WebAssetIcon}
                  onDeleteItem={() => {
                    // TODO move on individual function on the Provider
                    onDeleteDOMElement(domElement.path);
                    let arr = facetMap.get(facet.name);
                    arr = arr.filter((e) => e.name !== domElement.name);
                    facetMap.set(facet.name, arr);
                    setFacetMap(new Map(facetMap.set(facet.name, arr)));
                  }}
                  onGotoItem={() => { onGotoClick(domElement.path); }}
                  isFacet={false}
                />
              </>
            )
          }
          )}
        </StyledTreeItem>
      );
    });
  //{/* <FacetIconButton isSelected={true} name="keypad-outline"  title="Disable" aria-label="Disable" /> */ }
  const activateDeactivateElement = showSideBar
    ? (
      <FacetIconButton isSelected name="edit-2-outline" onClick={() => sideBarHandler()} src={facetLogoIce} title="Disable" />
    ) : (
      <FacetIconButton name="edit-2-outline" onClick={() => sideBarHandler()} src={facetLogo} title="Enable" aria-label="Enable" />
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
                <FacetImage title="facet" href="https://facet.ninja/" src={facetTypography} />
              </div>
              <div>
                <FacetIconButton title="info" name="info-outline" onClick={() => {
                  chrome.runtime.sendMessage({ data: ChromeRequestType.OPEN_WELCOME_PAGE });
                }} />
              </div>
              <div>
                <FacetIconButton title="logout" onClick={() => { logout() }} name="log-out-outline" size="large" />
              </div>
            </TopDiv>
            <br />
            <Divider style={{ backgroundColor: color.lightGray }} />
            <CopyToClipboard text={textToCopy}>
              <CodeSnippet onClick={() => {
                enqueueSnackbar({
                  message: `Copied snippet to clipboard!`,
                  variant: snackbar.info.text
                });
              }} text={textToCopy} />
            </CopyToClipboard>
            <Divider style={{ backgroundColor: color.lightGray }} />
            <div className={classes.drawerHeader}>
              {activateDeactivateElement}
              <FacetIconButton name="trash-2-outline" onClick={() => { reset(); }} title="Delete All" size="small" aria-label="Delete All" />
              <FacetIconButton title="save" name="save-outline" onClick={() => { onSaveClick(); }} size="small" aria-label="add" />
            </div>
          </div>
          <Divider />
          <TreeView
            className={classes.treeView}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
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
