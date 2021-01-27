import React, { useContext } from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from './AppContext';
import FacetTreeSideBar from './facetTreeSideBar/FacetTreeSideBar';
import { Fab } from '@material-ui/core';
import { color } from './shared/constant';
import AddIcon from '@material-ui/icons/Add';
import FacetLabel from './shared/FacetLabel';

const StyledDiv = styled.div`
    width: ${(props) => (props.drawer ? '100%' : '0')};
    height: '100%';
    color: white;
`;

export default function FacetToolbar() {

  const useStyles = makeStyles((theme) => ({
    divider: {
      // Theme Color, or use css color in quote
      border: '2px lightgray solid',
    },
    fabBtn: {
      color: color.darkGray,
      fill: color.darkGray,
      backgroundColor: color.lightGray,
    },
    fabGrid: {
      height: '10%',
      width: '100%',
      backgroundColor: color.darkGray,
      display: 'grid',
      gridTemplateColumns: '90% 10%',
      marginRight: '1rem'
    },
    grid1: {
      alignSelf: 'center',
      justifySelf: 'center',
    },
    grid2: {
      alignSelf: 'center',
      justifySelf: 'end',
      marginRight: '1rem',
      marginBottom: '2rem',
    }
  }));

  const sideBarHandler = () => {
    // window.highlightMode = showSideBar;
    setShowSideBar(!showSideBar);
    if (!showSideBar) {
      // TODO removeEventListeners
    }
  };

  const classes = useStyles();
  const { showSideBar, setShowSideBar, addFacet } = useContext(AppContext);

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: '90%' }}>
        <StyledDiv>
          <FacetTreeSideBar />
        </StyledDiv>
      </div>
      <div className={classes.fabGrid}>
        <div className={classes.grid1}>
          <FacetLabel text="© Facet 2021 - All rights reserved." />
        </div>
        <div className={classes.grid2}>
          <Fab onClick={() => addFacet()} size='small' className={classes.fabBtn} aria-label="add">
            <AddIcon />
          </Fab>
        </div>
      </div>
    </div >
  );
}
