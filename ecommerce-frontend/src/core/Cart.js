import React, {useState, useEffect} from 'react';
import {getCart} from "./cartHelpers";
import Layout from "./Layout";
import Search from "./Search";
import Card from "./Card";


const Cart = () => {
    const [items, setItems] = useState([])

    useEffect(() => {
        setItems(getCart)
    }, [])

    return (
        <Layout title="Home Page" description="Node react ecommerce app" className={'container-fluid'}>
            <Search/>
            <h3 className='mb-4'>New Arrivals</h3>
            <div className='row'>
                {productsByArriv.map((product, index) => (
                    <div key={index} className='col-4 mb-3'>
                        <Card product={product}/>
                    </div>
                ))}
            </div>
            <h3 className='mb-4'>Best Sellers</h3>
            <div className='row'>
                {productsBySell.map((product, index) => (
                    <div key={index} className='col-4 mb-3'>
                        <Card product={product}/>
                    </div>
                ))}
            </div>
        </Layout>
    )
};

export default Cart;