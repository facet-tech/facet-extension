import React from 'react';
import styled from 'styled-components';
import facetLogo from '../../static/images/facet_main_logo.svg';
import FacetImage from '../FacetImage';
import facetTypographyIcon from '../../static/images/facet_typography.svg';
import { makeStyles } from '@material-ui/core';

const BorderDiv = styled.div`
  border: 2px solid #758EBF;
  textAlign: center;
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
        <div style={{ textAlign: 'center' }}>
            <FacetImage src={facetLogo} />
        </div>
        <BorderDiv>
            {children}
        </BorderDiv>
        <br />
        <div className={classes.center}>
            <FacetImage src={facetTypographyIcon} />
        </div>
    </>;
}

