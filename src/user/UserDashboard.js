import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import moment from "moment";

import Layout from "../core/Layout";
import {isAuthenticated} from "../auth";
import { getPurchaseHistory } from "./apiUser";


const Dashboard = () => {
    const {user: {_id, name, email, role}} = isAuthenticated();
    const token = isAuthenticated().token;
    const [history, setHistory] = useState([]);

    const init = (userId, token) => {
        getPurchaseHistory(userId, token).then( data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setHistory(data);
            }
        })
    };

    useEffect(() => {
        init(_id, token)
    }, []);

    const renderDashboardName = () => {
        return `${name}'s Dashboard`
    };

    const userLinks = () => {
        return (
            <div className='card'>
                <h4 className='card-header'>User Links</h4>
                <ul className="list-group">
                    <li className='list-group-item'>
                        <Link className='nav-link' to='/cart'>My Cart</Link>
                    </li>
                    <li className='list-group-item'>
                        <Link className='nav-link' to={`/profile/${_id}`}>My Profile</Link>
                    </li>
                </ul>
            </div>
        )
    };

    const userInfo = () => {
        return (
            <div className='card mb-5'>
                <h3 className='card-header'>User Information</h3>
                <ul className="list-group">
                    <li className='list-group-item'><strong>Name:</strong> {name}</li>
                    <li className='list-group-item'><strong>Email:</strong> {email}</li>
                    <li className='list-group-item'><strong>Role:</strong> {role === 1 ? 'Admin' : 'Registered User'}</li>
                </ul>
            </div>
        )
    };

    const purchaseHistory = history => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">Purchase history</h3>
                <ul className="list-group">
                    <li className="list-group-item">
                        {history.map((h, i) => {
                            return (
                                <div>
                                    <hr />
                                    {h.products.map((p, index) => {
                                        return (
                                            <div key={i}>
                                                <h6>Product name: {p.name}</h6>
                                                <h6>Product price: ${p.price}</h6>
                                                <h6>
                                                    Purchased date:{" "}
                                                    {moment(h.updatedAt).calendar()}
                                                </h6>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </li>
                </ul>
            </div>
        );
    };


    return (
        <Layout title='Dashboard' description={renderDashboardName()} className='container-fluid'>
            <div className='row ml-2 mr-2'>
                <div className='col-xs-16 col-sm-16 col-md-4 mb-4'>
                    {userLinks()}
                </div>
                <div className='col-xs-16 col-sm-16 col-md-8'>
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div>
        </Layout>
    )
};

export default Dashboard;