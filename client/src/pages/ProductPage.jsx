import React, { useEffect, useState } from "react";
import { getProducts, createProduct } from "../api/productApi";

// export default function ProductPage() {
export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [from, setFrom] = useState({ name: "", stock: 0, location: "" });


    useEffect(() => {
        getProducts().then((response) => {
            console.log(response.data);
            setProducts(response.data);
        })
    }, []);

}