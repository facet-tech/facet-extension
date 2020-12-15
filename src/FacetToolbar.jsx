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
      color: color.ice,
      fill: color.ice,
      backgroundColor: color.darkGray,
      '&:hover': {
        backgroundColor: color.darkGray,
      },
    },
    fabGrid: {
      backgroundColor: color.darkGray,
      display: 'grid',
      // grid-template-columns: 75% 12.5% 12.5%;
      gridTemplateColumns: '90%  10%',
      // alignItems: 'end',
      // justifyContent: 'end',
      marginRight: '1rem'
    },
    grid1: {
      alignSelf: 'center',
      justifySelf: 'center'
    },
    grid2: {
      alignSelf: 'end',
      justifySelf: 'end',
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
      <div onClick={() => addFacet()} className={classes.fabGrid}>
        <div className={classes.grid1}>
          <FacetLabel text="© Facet 2021 - All rights reserved." />
        </div>
        <div className={classes.grid2}>
          <Fab size='small' className={classes.fabBtn} aria-label="add">
            <AddIcon />
          </Fab>
        </div>
      </div>
    </div>
  );
}
