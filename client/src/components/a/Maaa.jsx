import React, { useState } from 'react';
import { BoilingVerdict } from './BoilingVerdict';



const scales = {
    c: 'Celsius',
    f: 'Fahrenheit'
}

export function Maaa(props) {
    const sc = props.scale;
    const temp = props.temp;

    const handleTemp = (e) => {
        console.log("target :: ", e.target.value)
        props.onTempChange(e.target.value);
    }

    return (
        <fieldset>
            <legend>En Type : {scales[sc]}:</legend>
            <input value={temp} onChange={handleTemp} />
        </fieldset>
    );
}