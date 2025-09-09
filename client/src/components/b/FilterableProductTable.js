import React, { useState, useCallback, useEffect, useMemo, useReducer } from 'react';
import Search from '@components/b/Search';
import ProductTable from '@components/b/ProductTable';
import { getProducts, getProductsSearch } from '@api/productApi';
import { MemoChild } from '@components/c/MemoChild';


export default function FilterableProductTable() {
    const [products, setProducts] = useState([]);
    const [inStock, setInStock] = useState(false);
    const [search, setSearch] = useState("");
    // const [filtered, setFiltered] = useState([]);

    const [count, setCount] = useState(0);



    useEffect(() => {
        const fetchData = async () => {
            const response = search
                ? await getProductsSearch(search)
                : await getProducts();
            setProducts(response.data);
        }
        fetchData();
    }, [search]);

    const filtered = useMemo(() => {
        return inStock ? products.filter(p => p.stocked) : products;
    }, [inStock, products]);

    const handleSearch = useCallback((text) => {
        setSearch(text);
    }, []);

    const handleInStock = useCallback(() => {
        setInStock(v => v = !v);
    }, []);
    // const handleInStock = useCallback((checked) => {
    //     setInStock(checked);
    // }, []);


    const handleIncrement = useCallback((value) => {
        setCount(c => c + 1);
    }, []);



    const initialState = { count: 0 };

    function reducer(state, action) {
        console.log("reducer" + JSON.stringify(state));
        console.log("action" + JSON.stringify(action));
        switch (action.type) {
            case 'increment':
                return { count: state.count + 1 };
            case 'decrement':
                return { count: state.count - 1 };
            default:
                throw new Error();
        }
    }

    function Counter() {
        const [state, disp] = useReducer(reducer, initialState);
        console.log("Counter render" + JSON.stringify((state)));
        return (
            <>
                Count: {state.count}
                <button onClick={() => disp({ type: 'decrement' })}>-</button>
                <button onClick={() => disp({ type: 'increment' })}>+</button>
            </>
        );
    }



    return (
        <div style={{ border: "2px solid green", margin: "10px", padding: "10px" }}>
            <div>
                <Search data={search} search={handleSearch} stock={handleInStock} />
            </div>
            <div>
                <ProductTable data={filtered} />
            </div>

            <div>
                <div>Count: {count}</div>
                <MemoChild onIncrement={handleIncrement} />
            </div>

            <div>
                <Counter />
            </div>


        </div>
    )
}  