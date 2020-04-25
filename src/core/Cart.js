import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";

import { getCart } from "./cartHelpers";
import Layout from "./Layout";
import Card from "./Card";
import Checkout from "./Checkout";


const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    useEffect(() => {
        setItems(getCart)
    }, [run]);

    const showItems = (items) => {
        return (
            <div>
                <h4 className='text-center'>Your Shopping Cart:</h4>
                <hr/>
                {items.map((product, index) =>
                    (<Card key={index}
                           product={product}
                           showAddToCartButton={false}
                           cartUpdate={true}
                           showRemoveProductButton={true}
                           setRun={setRun}
                           run={run}
                    />))}
            </div>
        )
    };

    const showEmptyCart= () => (
        <div className='text-center'>
            <h4>Your shopping cart is empty. <br/><Link to='/shop'>Continue Shopping</Link></h4>
        </div>
    );

    return (
        <Layout title="Shopping Cart" description="Manage the courses in your cart" className={'container-fluid'}>
            <div className='row ml-2 mr-2'>
                <div className='col-xs-16 col-sm-16 col-md-6'>
                    {items.length > 0 ? showItems(items) : showEmptyCart()}
                </div>
                <div className='col-xs-16 col-sm-16 col-md-6'>
                    <h4 className='text-center'> Your Cart Summary:</h4>
                    <hr/>
                    <Checkout products={items} run={run} setRun={setRun}/>
                </div>
            </div>
        </Layout>
    )
};

export default Cart;