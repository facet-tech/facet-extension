import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import { color, color as colorConstant } from '../shared/constant.js';
import FacetIconButton from '../shared/FacetIconButton/FacetIconButton.jsx';
import FacetMenu from '../shared/FacetMenu/index.jsx';
import AppContext from '../AppContext.jsx';
import FacetInput from '../shared/FacetInput/index.js';
import useSelectedFacet from '../shared/hooks/useSelectedFacet';

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            backgroundColor: 'transparent',
        },
    },
    content: {
        "& svg": {
            fill: color.lightGray,
        }
    },
    group: {
        marginLeft: 0,
    },
    expanded: {
        border: `1px solid ${color.ice}`,
    },
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
        marginLeft: '.2rem'
    },
    labelRoot: {
        display: 'grid',
        gridTemplateColumns: '80% 10% 10%',
        alignItems: 'center',
        marginRight: '.5rem',
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
    const classes = useTreeItemStyles();
    const { labelText, labelIcon: LabelIcon, labelInfo,
        color, bgColor, onRenameItem, renamingFacet,
        onRenameCancelClick, onRenameSaveClick, ...other } = props;
    const { handleClickMenuEl, onGotoClick, setExpanded, selected, onDeleteFacet, onFacetClick } = useContext(AppContext);
    const [renameValue, setRenameValue] = useState('');
    const [selectedFacet, setSelectedFacet] = useSelectedFacet();

    const defaultElement =
        <div>
            <div className={classes.labelRoot}>
                <div>
                    <Typography
                        style={{ color: colorConstant.ice, marginLeft: props.isFacet ? '0' : '1rem' }}
                        variant="body2"
                        className={classes.labelText}>
                        {onRenameItem ? <b>{labelText}</b> : labelText}
                    </Typography>
                </div>
                {props.isFacet ?
                    <>
                        <div>
                            <FacetIconButton fill={colorConstant.grayA} name="eye-outline" />
                        </div>
                        <div>
                            <FacetIconButton fill={colorConstant.grayA} name="more-vertical-outline"
                                onClick={(e) => { handleClickMenuEl(e, labelText); setExpanded([labelText]); setSelected(labelText); setSelectedFacet(labelText); }} />
                            <FacetMenu isOpen={labelText === selectedFacet} gotoClick={() => { onGotoClick() }}
                                deleteClick={() => { onDeleteFacet(selected) }} onRenameClick={() => onRenameItem(selected)} />
                        </div>
                    </>
                    : <>
                        <div></div>
                        <div>
                            <FacetIconButton fill={colorConstant.grayA} customHeight="1.1rem" onClick={() => props.onDeleteItem()} name="trash-2" />
                        </div></>
                }
            </div>
        </div >;

    const keyPress = (e) => {
        if (e.key === "Escape") {
            onRenameCancelClick();
        }
        if (e.key === "Enter") {
            onRenameSaveClick(e.target.value);
        }
    }

    console.log('DURING...', renamingFacet);
    const duringRenameElement = <div>
        <Typography
            style={{ color: colorConstant.lightGray }}
            className={classes.labelText}
            variant="body2">
            {labelText}
        </Typography>
        <FacetInput
            inputRef={input => input && input.focus()}
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
            onClick={(e) => { console.log('ELA0'); if (props.isFacet) { onFacetClick(labelText) }; e.preventDefault(); }}
            onLabelClick={(e) => { console.log('ELA1'); e.preventDefault(); }}
            onIconClick={(e) => { console.log('ELA2'); e.preventDefault(); }}
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