import React, { useMemo } from 'react';

export function MemoChild({ onIncrement }) {


    return (
        <>
            <button onClick={onIncrement}>+</button>
        </>

    )
}

