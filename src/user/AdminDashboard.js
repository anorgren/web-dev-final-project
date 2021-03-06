import React from 'react';
import {Link} from "react-router-dom";

import Layout from "../core/Layout";
import {isAuthenticated} from "../auth";


const AdminDashboard = () => {
    const {user: {_id, name, email, role}} = isAuthenticated();

    const renderDashboardName = () => {
        return `${name}'s Dashboard`
    };

    const adminLinks = () => {
        return (
            <div className='card'>
                <h4 className='card-header'>User Links</h4>
                <ul className="list-group">
                    <li className='list-group-item'>
                        <Link className='nav-link' to='/create/category'>Create Category</Link>
                    </li>
                    <li className='list-group-item'>
                        <Link className='nav-link' to='/create/product'>Create Product</Link>
                    </li>
                    <li className='list-group-item'>
                        <Link className='nav-link' to='/admin/users/new'>Create User</Link>
                    </li>
                    <li className='list-group-item'>
                        <Link className='nav-link' to='/admin/orders'>Manage Orders</Link>
                    </li>
                    <li className='list-group-item'>
                        <Link className='nav-link' to='/admin/products'>Manage Products</Link>
                    </li>
                </ul>
            </div>
        )
    };

    const adminInfo = () => {
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

    return (
        <Layout title='Dashboard' description={renderDashboardName()} className='container-fluid'>
            <div className='row mr-2 ml-2 mb-2'>
                <div className='col-xs-16 col-sm-16 col-md-4 mb-4'>
                    {adminLinks()}
                </div>
                <div className='col-xs-16 col-sm-16 col-md-8'>
                    {adminInfo()}
                </div>
            </div>
        </Layout>
    )
};

export default AdminDashboard;