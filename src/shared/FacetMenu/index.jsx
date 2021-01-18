import React, { useContext } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppContext from '../../AppContext';
import { withStyles } from '@material-ui/core';
import { color } from '../constant';
import FacetCheckBox from '../FacetCheckBox';

const StyledMenu = withStyles({
  paper: {
    backgroundColor: color.lightGray,
    marginLeft: '2rem',
    padding: 0,
  }
})((props) => (
  <Menu
    MenuListProps={{ disablePadding: true }}
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

export default function FacetMenu({ isOpen = false, onGlobalCheckboxClick, onDomRemoveFacetClick, isGlobal, isDomRemove, onRenameClick, gotoClick, deleteClick }) {
  const { handleCloseMenuEl, menuAnchorEl } = useContext(AppContext);
  return (
    <div>
      <StyledMenu
        id="facet-menu"
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl && isOpen)}
        onClose={handleCloseMenuEl}
      >
        <StyledMenuItem onClick={() => { onGlobalCheckboxClick() }}>
          <FacetCheckBox checked={isGlobal} text="Global" />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => { onDomRemoveFacetClick() }}>
          <FacetCheckBox checked={isDomRemove} text="DOM Remove" />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => { onRenameClick(); handleCloseMenuEl(); }}>Rename</StyledMenuItem>
        <StyledMenuItem onClick={() => { deleteClick(); handleCloseMenuEl(); }}>Delete</StyledMenuItem>
      </StyledMenu>
    </div>
  );
}