import React from 'react';
import styled from 'styled-components';
import FacetFormError from '../../static/images/facet_form_error.svg'
import FacetImage from '../FacetImage';

const StyledDiv = styled.div`
    textAlign: 'center'
`;

const ErrorSpan = styled.span`
    color: #FF5050;
`;

export default ({ text, ...other }) => {
    return <StyledDiv>
        <FacetImage src={FacetFormError} />
        <ErrorSpan {...other}>{text}</ErrorSpan>
    </StyledDiv>
}
