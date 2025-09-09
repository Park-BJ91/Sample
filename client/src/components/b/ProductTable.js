import React, { Fragment } from 'react';
import Category from '@components/b/Category';

export default function ProductTable(props) {

    const categroyGroup = props.data.reduce((r, a) => {
        if (!r[a.category]) r[a.category] = [];
        r[a.category].push(a);
        return r;
        // (r[a.category] = r[a.category] || []).push(a);
        // return r;
    }, {});
    return (
        <div style={{ border: "1px solid blue", padding: "10px" }}>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(categroyGroup).map(([key, value]) => (
                        <Fragment key={key}>
                            <tr>
                                <th colSpan="2" style={{ textAlign: "left" }}>{key}</th>
                            </tr>
                            {value.map((item) => (
                                <Category key={item.name} item={item} />
                            ))}
                        </Fragment>
                    ))}
                </tbody>
            </table>

        </div>
    )
};
