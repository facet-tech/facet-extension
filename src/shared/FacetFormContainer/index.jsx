import React from 'react';
import styled from 'styled-components';
import facetLogo from '../../static/images/facet_main_logo.svg';
import FacetImage from '../FacetImage';
import facetTypographyIcon from '../../static/images/facet_typography.svg';
import { makeStyles } from '@material-ui/core';
import { color } from '../constant';
import MarginTop from '../MarginTop';

const BorderDiv = styled.div`
  border: 2px solid ${color.ice};
  padding: 1rem;
`;

const useStyles = makeStyles(() => ({
    center: {
        textAlign: 'center',
    },
}));

export default ({ children }) => {
    const classes = useStyles();

    return <>
        <MarginTop value="2rem" />
        <div style={{ textAlign: 'center' }}>
            <FacetImage src={facetLogo} />
        </div>
        <br />
        <BorderDiv>
            {children}
        </BorderDiv>
        <br />
        <div className={classes.center}>
            <FacetImage src={facetTypographyIcon} />
        </div>
        <MarginTop value="2rem" />
    </>;
}

