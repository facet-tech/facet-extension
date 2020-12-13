import React, { useState, useContext } from 'react';
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
import AppContext from '../AppContext.jsx';
import FacetInput from '../shared/FacetInput/index.js';

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:focus > $content, &$selected > $content': {
            // FIXME this is buggy
            // backgroundColor: `var(--tree-view-bg-color, ${color.ice})`,
            // color: 'var(--tree-view-color)',
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            backgroundColor: 'transparent',
        },
    },
    content: {
        // color: theme.palette.text.secondary,
        // borderTopRightRadius: theme.spacing(2),
        // borderBottomRightRadius: theme.spacing(2),
        // paddingRight: theme.spacing(1),
        // fontWeight: theme.typography.fontWeightMedium,
        // '$expanded > &': {
        //     fontWeight: theme.typography.fontWeightRegular,
        // },
        // paddingLeft: 0,
    },
    group: {
        marginLeft: 0,
        '& $content': {
            // paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
        marginLeft: '.2rem'
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
        paddingRight: 0,
        padding: 0
    },
}));

function StyledTreeItem(props) {
    console.log('checkare me', props)
    const classes = useTreeItemStyles();
    const { labelText, labelIcon: LabelIcon, labelInfo, color,
        bgColor, onRenameItem, renamingFacet,
        onRenameCancelClick, onRenameSaveClick, ...other } = props;
    const { handleClickMenuEl, onGotoClick, setExpanded, setSelectedFacet, setSelected, selected, onDeleteFacet } = useContext(AppContext);
    const [renameValue, setRenameValue] = useState('');
    const defaultElement =
        <div>
            <div className={classes.labelRoot}>
                <Typography
                    style={{ color: colorConstant.ice, marginLeft: props.isFacet ? '0' : '1rem' }}
                    variant="body2"
                    className={classes.labelText}>
                    {onRenameItem ? <b>{labelText}</b> : labelText}
                </Typography>

                {props.isFacet ? <div>
                    <FacetIconButton name="more-vertical-outline" onClick={(e) => { handleClickMenuEl(e, labelText); setExpanded([labelText]); setSelected(labelText); setSelectedFacet(labelText); }} />
                    <FacetMenu gotoClick={() => { onGotoClick() }} deleteClick={() => { onDeleteFacet(selected) }} onRenameClick={() => onRenameItem(selected)} />
                </div>
                    : <div>
                        <FacetIconButton onClick={() => props.onDeleteItem()} name="trash-2" />
                    </div>
                }
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
        <Typography
            style={{ color: colorConstant.lightGray }}
            className={classes.labelText}
            variant="body2">
            {labelText}
        </Typography>
        <FacetInput
            inputRef={input => input && input.focus()}
            // autoFocus
            onKeyDown={keyPress}
            onChange={(e) => { setRenameValue(e.target.value) }}>
        </FacetInput>
        <IconButton onClick={() => { onRenameSaveClick(renameValue) }} aria-label="delete" component="span">
            <CheckIcon color="inherit" className={classes.labelIcon} />
        </IconButton>
        <IconButton onClick={() => { onRenameCancelClick() }} aria-label="delete" component="span">
            <CancelIcon color="inherit" className={classes.labelIcon} />
        </IconButton>
    </div>;

    return (
        <TreeItem
            {...other}
            // check if those are needed
            onClick={(e) => { e.preventDefault(); }}
            onLabelClick={(e) => { e.preventDefault(); }}
            onIconClick={(e) => { e.preventDefault(); }}
            // disableSelection={true}
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