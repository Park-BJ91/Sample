import React, { } from 'react';

import { ElementComponent } from '@components/a/ElementA';



export function ParantComponent() {

    const map = new Map();
    map.set("one", 1);
    map.set("two", 4);
    map.set("three", 9);

    const obj = Object.fromEntries(map);


    return (
        <div>
            <h2>부모</h2>
            <ElementComponent data={obj} b="??" />
        </div>
    );

}