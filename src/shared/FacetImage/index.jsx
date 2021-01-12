import React from 'react';

export default (props) => {
    const aElement = props.href ? <a target="_blank" href={props.href} rel='noopener'> <img {...props} />
    </a> :
        <>
            <img {...props} />
        </>;
    return aElement
}
