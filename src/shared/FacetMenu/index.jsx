import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppContext from '../../AppContext';
import { withStyles } from '@material-ui/core';
import { color } from '../constant';
import facetPolygon from '../../static/images/facet_polygon.svg';
import FacetImage from '../FacetImage';
import ColorMenu from '../ColorMenu';

const StyledMenu = withStyles({
  paper: {
    backgroundColor: color.lightGray,
    padding: 0,
  },
  '& .MuiList-padding ': {
    paddingTop: 0,
    paddingBotom: 0
  }
})((props) => (
  <Menu
    MenuListProps={{ disablePadding: true }}
    backgroundColor={color.darkGray}
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    border: '1px solid ' + color.menuDivider,
    '&:focus': {
      backgroundColor: color.lightGray,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: color.ice,
      },
    },
  },
}))(MenuItem);



export default function FacetMenu() {
  const { handleClickMenuEl, handleCloseMenuEl, menuAnchorEl } = useContext(AppContext);
  const [colorMenuOpen, setColorMenuOpen] = useState(true);
  console.log('colorMenuOpen', colorMenuOpen);
  const onColorMenuClick = (e) => {
    // setColorMenuOpen(!colorMenuOpen);
  }

  return (
    <div>
      <Button aria-controls="facet-menu" aria-haspopup="true" onClick={handleClickMenuEl}>
        Open Menu
      </Button>
      <StyledMenu
        id="facet-menu"
        anchorEl={menuAnchorEl}
        keepMounted
        open={true}
        onClose={handleCloseMenuEl}
      >
        <StyledMenuItem onClick={() => { }}>Rename</StyledMenuItem>
        <StyledMenuItem onClick={() => { }}>
          Color {'>'}
          <ColorMenu />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => { }}>Go to</StyledMenuItem>
        <StyledMenuItem onClick={() => { }}>Delete</StyledMenuItem>
      </StyledMenu>
    </div>
  );
}