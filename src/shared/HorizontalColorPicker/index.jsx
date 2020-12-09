import React from 'react';
import styled from 'styled-components';
import { color } from '../constant';

const DotSpan = styled.span`
    height: 25px;
    width: 25px;
    background-color: ${props => props.backgroundColor};
    border-radius: 50%;
    display: inline-block;
`;

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
`;

export default () => {
    return <GridDiv>
        <div>
            <DotSpan backgroundColor={color.menuColor.red} />
        </div>
        <div>
            <DotSpan backgroundColor={color.menuColor.lightGreen} />
        </div>
        <div>
            <DotSpan backgroundColor={color.menuColor.lightBlue} />
        </div>
        <div>
            <DotSpan backgroundColor={color.menuColor.lightPurple} />
        </div>
        <div>
            <DotSpan backgroundColor={color.menuColor.green} />
        </div>
    </GridDiv>
}