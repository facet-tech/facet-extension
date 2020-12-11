import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppContext from '../../AppContext';
import { withStyles } from '@material-ui/core';
import { color } from '../constant';

const StyledMenu = withStyles({
  paper: {
    backgroundColor: color.lightGray,
    marginLeft: '2rem',
    padding: 0,
  }
})((props) => (
  <Menu
    MenuListProps={{ disablePadding: true }}
    backgroundColor={color.darkGray}
    getContentAnchorEl={null}
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

export default function FacetMenu({ onRenameClick, gotoClick, deleteClick }) {
  const { handleClickMenuEl, handleCloseMenuEl, menuAnchorEl, selected, selectedFacet } = useContext(AppContext);
  return (
    <div>
      <StyledMenu
        id="facet-menu"
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenuEl}
      >
        <StyledMenuItem onClick={() => { onRenameClick(); handleCloseMenuEl(); }}>Rename</StyledMenuItem>
        <StyledMenuItem onClick={() => { gotoClick(); }}>Go to</StyledMenuItem>
        <StyledMenuItem onClick={() => { deleteClick(); handleCloseMenuEl(); }}>Delete</StyledMenuItem>
      </StyledMenu>
    </div>
  );
}