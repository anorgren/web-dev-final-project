import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";

import {isAuthenticated} from "../auth";
import { emptyCart } from "./cartHelpers";
import { getBraintreeClientToken, processPayment, createOrder } from "./apiCore";
import {red} from "color-name";


const Checkout = ({products, setRun= f=> f, run = undefined}) => {
    const [data, setData] = useState({
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: '',
        loading: false
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    useEffect(() => {
        getToken(userId, token)
    }, []);

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if (data.error) {
                setData({...data, error: data.error})
            } else {
                setData({clientToken: data.clientToken})
            }
        })
    };


    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0)
    };

    const getCount = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count;
        }, 0)
    };

    const renderCheckoutButtons = () => {
        return (
            isAuthenticated() ? (
                <div>{showDropIn()}</div>
            ) :(
                <Link to='/signin'>
                    <button className='btn btn-primary'>Sign In To Checkout</button>
                </Link>
            )
        )
    };

    let shippingAddress = data.address;

    const buy = () => {
        setData({ loading: true });
        let nonce;
        let getNonce = data.instance
            .requestPaymentMethod()
            .then(data => {
                nonce = data.nonce;
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                };

                processPayment(userId, token, paymentData)
                    .then(response => {
                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: shippingAddress
                        };

                        createOrder(userId, token, createOrderData)
                            .then(response => {
                                emptyCart(() => {
                                    setRun(!run);
                                    setData({
                                        loading: false,
                                        success: true
                                    });
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                setData({ loading: false });
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        setData({ loading: false });
                    });
            })
            .catch(error => {
                // console.log("dropin error: ", error);
                setData({ ...data, error: error.message });
            });
    };

    const handleAddress = (event) => {
        setData({...data, address: event.target.value})
    };

    const showDropIn = () => (
        <div onBlur={() => setData({...data, error: ""})}>
            {data.clientToken !== null && products.length > 0 ? (
                <div className=''>
                    <br/>
                    <div className='gorm-group mb-3'>
                        <label className='text-muted'>Delivery Address:</label>
                        <textarea onChange={handleAddress}
                                  className='form-control'
                                  value={data.address}
                                  placeholder='Add your delivery address'/>
                    </div>
                    <DropIn options={{
                        authorization: data.clientToken,
                    }} onInstance={instance => (data.instance = instance)}/>
                    {data.success ? '' : <button onClick={buy} className='btn btn-primary btn-block'>Pay</button>  }
                </div>
            ) : null}
        </div>
    );

    const showError = error => {
        return (
            <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
                {error}
            </div>
        )
    };

    const showLoading = loading => (
        loading && <h4 style={{color: red}}>Loading...</h4>
    );

    const showSuccess = success => {
        return (
            <div className='alert alert-info' style={{display: success ? '' : 'none'}}>
                Thank you for your order. Payment was successful.
            </div>
        )
    };

    return (
        <div>
            {showLoading()}
            {showSuccess(data.success)}
            {showError(data.error)}
            <h5>Total Cost: ${getTotal()}</h5>
            <h5>Total items: {getCount()}</h5>
            {renderCheckoutButtons()}
        </div>
    )
};

export default Checkout;