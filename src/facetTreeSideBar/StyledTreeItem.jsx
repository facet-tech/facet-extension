import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import { color, color as colorConstant } from '../shared/constant.js';
import FacetIconButton from '../shared/FacetIconButton/FacetIconButton.jsx';
import MoreSettingsIcon from '../static/images/facet_more_settings.svg';
import FacetMenu from '../shared/FacetMenu/index.jsx';
import styled from 'styled-components';

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:focus > $content, &$selected > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${color.ice})`,
            color: 'var(--tree-view-color)',
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            backgroundColor: 'transparent',
        },
        // '& .MuiTreeItem-iconContainer': {
        //     width: 0,
        //     marginRight: '0px'
        // },
        // '& .MuiTreeItem-label': {
        //     padding: 0,
        //     margin: 0
        // }
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 0,
        '& $content': {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
        margin: '1rem'
    },
}));

const SideColorDiv = styled.div`
    width: .5rem;
    background-color: red;
    align-self: stretch;
`;

function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const { labelText, labelIcon: LabelIcon, labelInfo, color,
        bgColor, onRenameItem, renamingFacet, onDeleteItem,
        onRenameCancelClick, onRenameSaveClick, ...other } = props;
    const [renameValue, setRenameValue] = useState('');

    const defaultElement =
        <div>
            <div className={classes.labelRoot}>
                {/* <SideColorDiv value='red'>
                </SideColorDiv> */}
                <div style={{ backgroundColor: 'red' }}></div>
                <Typography style={{ color: colorConstant.lightGray }} variant="body2" className={classes.labelText}>
                    {onRenameItem ? <b>{labelText}</b> : labelText}
                </Typography>
                {/* 
                {onRenameItem ? <FacetIconButton onClick={() => { onRenameItem() }} aria-label="rename" component="span">
                    <EditIcon color="inherit" className={classes.labelIcon} />
                </FacetIconButton> : null}
                <IconButton onClick={() => { onDeleteItem() }} aria-label="upload picture" component="span">
                    <DeleteForeverIcon color="inherit" className={classes.labelIcon} />
                </IconButton> */}

                <FacetIconButton src={MoreSettingsIcon} onClick={() => { }} />
                {/* <FacetMenu /> */}
            </div>
        </div>;

    const keyPress = (e) => {
        if (e.key === "Escape") {
            onRenameCancelClick();
        }
        if (e.key === "Enter") {
            onRenameSaveClick(e.target.value);
        }
    }

    const duringRenameElement = <div>
        <Typography variant="body2" className={classes.labelText}>
            {labelText}
        </Typography>
        <TextField
            inputRef={input => input && input.focus()}
            autoFocus
            style={{ width: '50%' }} onKeyDown={keyPress}
            onChange={(e) => { setRenameValue(e.target.value) }}>
        </TextField>
        <IconButton onClick={() => { onRenameSaveClick(renameValue) }} aria-label="delete" component="span">
            <CheckIcon color="inherit" className={classes.labelIcon} />
        </IconButton>
        <IconButton onClick={() => { onRenameCancelClick() }} aria-label="delete" component="span">
            <CancelIcon color="inherit" className={classes.labelIcon} />
        </IconButton>
    </div>;

    return (
        <TreeItem
            // check if those are needed
            onClick={(e) => { e.preventDefault(); }}
            onLabelClick={(e) => { e.preventDefault(); }}
            onIconClick={(e) => { e.preventDefault(); }}
            label={
                renamingFacet ? duringRenameElement : defaultElement
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                group: classes.group,
                label: classes.label,
            }}
            {...other}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};

export default StyledTreeItem;