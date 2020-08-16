import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import MailIcon from '@material-ui/icons/Mail';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Button from '@material-ui/core/Button';
import BasicTextField from './BasicTextField';
import AppContext from './AppContext';
import { useSnackbar } from 'notistack';
import VisibilityBtn from './VisibilityBtn';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import $ from 'jquery';

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:focus > $content, &$selected > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            backgroundColor: 'transparent',
        },
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
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
}));


export default function StyledTreeItem(props) {
    const { addedElements, disabledFacets, setDisabledFacets, setIsAddingFacet } = useContext(AppContext);

    const handleDisplayHideChange = (facetLabel, shouldDisable) => {
        // const shouldDisable = disabledFacets.includes(facetLabel);
        var elements = addedElements && addedElements.get(facetLabel);
        elements.forEach(element => {
            if (!shouldDisable) {
                $(`#${element}`).css('background-color', 'red');
            } else {
                $(`#${element}`).css('background-color', 'unset');
            }
        });
    }

    const handleAdd = () => {
        setIsAddingFacet(true);
    }

    const classes = useTreeItemStyles();
    const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, facetLabel, elementLabel, hasPlusBtn = false, hasDeleteBtn = false, hasViewBtn = false, hasHideBtn = true, ...other } = props;
    const shouldDisable = disabledFacets.includes(labelText);
    return (
        <TreeItem
            label={
                <div className={classes.labelRoot}>
                    <Typography variant="body2" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                    {hasPlusBtn ? <Button onClick={() => { handleAdd() }}>+</Button> : null}
                    {hasViewBtn ? <VisibilityBtn visible={!shouldDisable}
                        onClick={() => {
                            if (!shouldDisable) {
                                const res = [...disabledFacets, facetLabel];
                                // setDisabledFacets(res);
                            } else {
                                const res = disabledFacets.filter(e => e !== facetLabel);
                                // setDisabledFacets(res);
                            }

                            handleDisplayHideChange(facetLabel, shouldDisable)
                        }}></VisibilityBtn> : null}
                    {hasDeleteBtn ? <Button onClick={() => { }} color="primary" aria-label="add">
                        {<DeleteOutlineIcon />}
                    </Button> : null}
                </div>
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
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};