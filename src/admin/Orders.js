import React, { useState, useEffect } from 'react';

import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import {getStatusValues, listOrders, updateOrderStatus} from "./apiAdmin";
import moment from 'moment';


const Orders = () => {
    const {user, token} = isAuthenticated();
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);


    const loadOrders = () => {
        listOrders(user._id, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setOrders(data)
                }
            })
    };

    const loadStatusValues = () => {
        getStatusValues(user._id, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setStatusValues(data)
                }
            })
    };

    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, []);

    const showNumberOrders = () => {
        if (orders.length === 0) {
            return (
                <h3 className='text danger'>No Orders</h3>
            )
        } else {
            return (
                <h3>Total Orders: {orders.length}</h3>
            )
        }
    };

    const showInput = (title, value) => (
        <div className='input-group mb-2 mr-sm-2'>
            <div className='input-group'>
                <div className='input-group'>
                    <strong>{title}</strong> &nbsp;&nbsp;{value}
                </div>
            </div>
        </div>
    );

    const showStatus = (order) => (
        <div className='form-group'>
            <h6 className='mb-2'>
                Status: {order.status} <br/>
                <select className='form-control'
                        onChange={(e) => handleStatusChange(e, order._id)}>
                    <option>Update Status</option>
                    {statusValues.map(
                        (status, index) => (<option key={index} value={status}>{status}</option>)
                        )}
                </select>
            </h6>
        </div>
    );

    const handleStatusChange = (event, orderId) => {
        updateOrderStatus(user._id, token, orderId, event.target.value)
            .then(data => {
                if (data.error) {
                    console.log('Status Update Failed')
                } else {
                    loadOrders();
                }
            })
    };

    return (
        <Layout title='Manage Orders' description="View existing orders and update status" className={'container-fluid'}>
            {showNumberOrders()}
            <table class='table mr-2 ml-2'>
                <thead>
                    <th scope="col">Order #</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Purchased By</th>
                    <th scope="col">Amount</th>
                </thead>
                <tbody>
                {orders.map((order, index) => (
                    <tr>
                            <th scope='row'>{order.transactionId}</th>
                            <td scope='row'>{showStatus(order)}</td>
                            <td scope='row'>{moment(order.createdAt).calendar()}</td>
                            <td scope='row'>{order.user.name}</td>
                            <td scope='row'>${order.amount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/*<div className='row'>*/}
            {/*    <div className='col-md-8 offset-md-2'>*/}
            {/*        {showNumberOrders()}*/}
            {/*        {orders.map((order, orderIndex) => {*/}
            {/*            return (*/}
            {/*                <div className='mt-5' key={orderIndex} style={{borderBottom:"3px solid grey"}}>*/}
            {/*                    <h5 className='mb-1'>*/}
            {/*                        <span className='bg-secondary' style={{color: "white"}}>Order ID: {order._id}</span>*/}
            {/*                    </h5>*/}
            {/*                    <ul className='list-group mb2'>*/}
            {/*                        <li className='list-group-item'>*/}
            {/*                            {showStatus(order)}*/}
            {/*                        </li>*/}
            {/*                        <li className='list-group-item'>*/}
            {/*                            Transaction ID: {order.transaction_id}*/}
            {/*                        </li>*/}
            {/*                        <li className='list-group-item'>*/}
            {/*                            Amount: ${order.amount}*/}
            {/*                        </li>*/}
            {/*                        <li className='list-group-item'>*/}
            {/*                            Purchaser: {order.user.name}*/}
            {/*                        </li>*/}
            {/*                        <li className='list-group-item'>*/}
            {/*                            Ordered on: {moment(order.createdAt).calendar()}*/}
            {/*                        </li>*/}
            {/*                        <li className='list-group-item'>*/}
            {/*                            Delivery Address: {order.address}*/}
            {/*                        </li>*/}
            {/*                    </ul>*/}
            {/*                    <h5 className='mt-2 font-italic'>*/}
            {/*                        Total Items Ordered: {order.products.length}*/}
            {/*                    </h5>*/}
            {/*                    {order.products.map((product, productIndex) => (*/}
            {/*                        <div className='mb-2'*/}
            {/*                             key={productIndex}*/}
            {/*                             style={{padding:'20px'}}>*/}
            {/*                            {showInput('Product Name: ', product.name)}*/}
            {/*                            {showInput('Product Price: ', product.price)}*/}
            {/*                            {showInput('Product Quantity: ', product.count)}*/}
            {/*                            {showInput('Product ID: ', product._id)}*/}
            {/*                        </div>*/}
            {/*                        )*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            )*/}
            {/*        })}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </Layout>
    )
};

export default Orders;