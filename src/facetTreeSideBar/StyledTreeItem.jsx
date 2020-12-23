import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import { color, color as colorConstant } from '../shared/constant.js';
import FacetIconButton from '../shared/FacetIconButton/FacetIconButton.jsx';
import FacetMenu from '../shared/FacetMenu/index.jsx';
import AppContext from '../AppContext.jsx';
import FacetInput from '../shared/FacetInput/index.js';

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
    // color of the dropdown
    content: {
        "& .MuiTreeItem-iconContainer svg": {
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
    renameDiv: {
        display: 'grid',
        gridTemplateColumns: '60% 10% 10%',
        columnGap: '7%',
        alignItems: 'end'
    }
}));

function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const { labelText, labelIcon: LabelIcon, labelInfo,
        color, bgColor, onRenameItem, renamingFacet,
        onRenameCancelClick, onRenameSaveClick, ...other } = props;
    const {
        handleClickMenuEl, onGotoClick, setExpanded,
        onDeleteFacet, onFacetClick, facetMap,
        nonRolledOutFacets, setNonRolledOutFacets,
        selectedFacet, setSelectedFacet } = useContext(AppContext);
    const [renameValue, setRenameValue] = useState(labelText);

    const enableFacetIconBtn = <FacetIconButton name="eye-outline" onClick={() => {
        setNonRolledOutFacets([...nonRolledOutFacets, labelText])
    }}
        fill={colorConstant.grayA} />;

    const disableFacetIconBtn = <FacetIconButton
        onClick={() => {
            setNonRolledOutFacets(nonRolledOutFacets?.filter(e => e !== labelText));
        }}
        fill={colorConstant.grayA}
        name={"eye-off-outline"} />;

    const isEnabled = nonRolledOutFacets.includes(labelText);
    const defaultElement =
        <div key={labelText + isEnabled}>
            <div className={classes.labelRoot}>
                <div>
                    <Typography
                        style={{
                            color: colorConstant.ice,
                            margin: props.isFacet ? '0' : '0 0 .4rem 1rem'
                        }}
                        variant="body2"
                        className={classes.labelText}>
                        {onRenameItem ? <b>{labelText}</b> : labelText}
                    </Typography>
                </div>

                {props.isFacet ?
                    <>
                        <div>
                            {!nonRolledOutFacets.includes(labelText) ? enableFacetIconBtn : disableFacetIconBtn}
                        </div>
                        <div>
                            <FacetIconButton
                                key={labelText}
                                fill={colorConstant.grayA}
                                name="more-vertical-outline"
                                onClick={(e) => {
                                    handleClickMenuEl(e, labelText);
                                    setExpanded([labelText]);
                                    setSelectedFacet(labelText);
                                }} />
                            <FacetMenu
                                isOpen={labelText === selectedFacet}
                                gotoClick={() => {
                                    const domPath = facetMap.get(selectedFacet) &&
                                        facetMap.get(selectedFacet)[0]?.path;
                                    onGotoClick(domPath);
                                }}
                                deleteClick={() => { onDeleteFacet(selectedFacet) }}
                                onRenameClick={() => onRenameItem(selectedFacet)} />
                        </div>
                    </>
                    : <>
                        <div>
                            <FacetIconButton fill={colorConstant.grayA} customHeight="1.1rem" onClick={() => props.onGotoItem()} name="diagonal-arrow-right-up-outline" />
                        </div>
                        <div>
                            <FacetIconButton fill={colorConstant.grayA} customHeight="1.1rem" onClick={() => props.onDeleteItem()} name="trash-2" />
                        </div>
                    </>
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

    const duringRenameElement = <div className={classes.renameDiv}>
        <FacetInput
            value={renameValue}
            inputRef={input => input && input.focus()}
            onKeyDown={keyPress}
            onChange={(e) => { setRenameValue(e.target.value) }}>
        </FacetInput>
        <FacetIconButton name="checkmark-outline" onClick={() => { onRenameSaveClick(renameValue) }} aria-label="delete" component="span" />
        <FacetIconButton name="close-circle" onClick={() => { onRenameCancelClick() }} aria-label="delete" component="span" />
    </div>;

    return (
        <TreeItem
            {...other}
            // check if those are needed
            onClick={(e) => { if (props.isFacet) { onFacetClick(labelText) }; e.preventDefault(); }}
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
        />
    );
}

export default StyledTreeItem;