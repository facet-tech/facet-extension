import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppContext from '../../AppContext';
import { makeStyles, withStyles } from '@material-ui/core';
import { color } from '../constant';

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
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function FacetMenu() {
  const { handleClickMenuEl, handleCloseMenuEl, menuAnchorEl } = useContext(AppContext);

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickMenuEl}>
        Open Menu
      </Button>
      <StyledMenu
        id="simple-menu"
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenuEl}
      >
        <StyledMenuItem onClick={handleCloseMenuEl}>Rename</StyledMenuItem>
        <StyledMenuItem onClick={handleCloseMenuEl}>Color</StyledMenuItem>
        <StyledMenuItem onClick={handleCloseMenuEl}>Go to</StyledMenuItem>
        <StyledMenuItem onClick={handleCloseMenuEl}>Delete</StyledMenuItem>
      </StyledMenu>
    </div>
  );
}