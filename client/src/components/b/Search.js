import React, { useState } from 'react';

export default function Search(props) {
    const [searchText, setSearchText] = useState("");

    const searchButton = () => {
        props.search(searchText);
    }

    const checkboxStock = (e) => {
        props.stock(e.target.checked);
    }

    return (
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexDirection: "column", border: "1px solid blue", padding: "10px" }}>
            <div>
                <input type="text" onChange={e => setSearchText(e.target.value)} placeholder="Search..." />
                <button onClick={searchButton}>Search</button>
            </div>
            <div>
                <input type="checkbox" onChange={checkboxStock} /> Only show products in stock
            </div>
        </div>
    )

}