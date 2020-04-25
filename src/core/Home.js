import React, { useState, useEffect } from 'react';

import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";


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
        <Layout title="Coursify" description="Learn and expand your knowledge through self-study" className={'container-fluid'}>
            <Search/>
            <h3 className='mb-4 mr-2 ml-2'>New Arrivals</h3>
            <div className='row mr-2 ml-2'>
                {productsByArriv.map((product, index) => (
                    <div key={index} className='col-4 mb-3'>
                        <Card product={product}/>
                    </div>
                    ))}
            </div>
            <h3 className='mb-4 mr-2 ml-2'>Best Sellers</h3>
            <div className='row mr-2 ml-2'>
                {productsBySell.map((product, index) => (
                    <div key={index} className='col-4 mb-3'>
                        <Card product={product}/>
                    </div>
                ))}
            </div>
        </Layout>
    )
};

export default Home;