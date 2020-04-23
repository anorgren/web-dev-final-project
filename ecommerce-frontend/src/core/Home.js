import React, { useState, useEffect } from 'react';

import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";


const Home = () => {
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArriv, setProductsByArriv] = useState([]);
    const [error, setError] = useState(false);

    const loadProductsBySell = () => {
        getProducts('sold').then(data => {
            if(data.error) {
                setError(data.error)
            } else {
                setProductsBySell(data)
            }
        })
    };

    const loadProductsByArrival = () => {
        getProducts('createdAt').then(data => {
            if(data.error) {
                setError(data.error)
            } else {
                setProductsByArriv(data)
            }
        })
    };

    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, []);

    return (
        <Layout title="Home Page" description="Node react ecommerce app" className={'container-fluid'}>
            <h3 className='mb-4'>New Arrivals</h3>
            <div className='row'>
                {productsByArriv.map((product, index) => (<Card key={index} product={product}/>))}
            </div>
            <h3 className='mb-4'>Best Sellers</h3>
            <div className='row'>
                {productsBySell.map((product, index) => (<Card key={index} product={product}/>))}
            </div>
        </Layout>
    )
};

export default Home;