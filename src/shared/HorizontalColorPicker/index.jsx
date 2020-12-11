import React from 'react';
import styled from 'styled-components';
import { color as colorConstant } from '../constant';


const SvgIcon = (color) => <svg height="25" width="25">
    <circle cx="12.5" cy="12.5" r="7.5" stroke="black" stroke-width="1" fill={color} />
</svg>;

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    background-color: ${colorConstant.lightGray}
`;

export default () => {
    return <GridDiv>
        <div >
            {SvgIcon(colorConstant.menuColor.red)}
        </div>
        <div >
            {SvgIcon(colorConstant.menuColor.lightGreen)}
        </div>
        <div >
            {SvgIcon(colorConstant.menuColor.lightBlue)}
        </div>
        <div >
            {SvgIcon(colorConstant.menuColor.lightPurple)}
        </div>
        <div>
            {SvgIcon(colorConstant.menuColor.green)}
        </div>
    </GridDiv>
}