import React from 'react';

export default ({ text, color = '#A4A7AC', fontSize = 'small' }) => {
    return <span
        style={{
            width: '100%',
            color,
            fontSize
        }}
    >{text}</span>
}