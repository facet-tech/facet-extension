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
        <div onClick={() => { console.log('HEY1') }}>
            {SvgIcon(colorConstant.menuColor.red)}
        </div>
        <div onClick={() => { console.log('HEY2') }}>
            {SvgIcon(colorConstant.menuColor.lightGreen)}
        </div>
        <div onClick={() => { console.log('HEY3') }}>
            {SvgIcon(colorConstant.menuColor.lightBlue)}
        </div>
        <div onClick={() => { console.log('HEY4') }}>
            {SvgIcon(colorConstant.menuColor.lightPurple)}
        </div>
        <div onClick={() => { console.log('HEY5') }}>
            {SvgIcon(colorConstant.menuColor.green)}
        </div>
    </GridDiv>
}