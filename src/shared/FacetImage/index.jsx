import React from 'react';

export default (props) => {
    const aElement = props.href ? <a href={props.href} > <img {...props} />
    </a> :
        <>
            <img {...props} />
        </>;
    return aElement
}
