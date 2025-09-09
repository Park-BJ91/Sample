import React from 'react';

export function BoilingVerdict(props) {
    console.log(props);
    if (props.celsius >= 100) {
        return <p>boil</p>
    }
    return <p>not boil</p>
}