import React from 'react';

export default function Category(props) {


    return (
        <tr style={{ color: props.item.stocked ? "black" : "red" }}>
            <td>{props.item.name}</td>
            <td>{props.item.price}</td>
        </tr>
    )
}
