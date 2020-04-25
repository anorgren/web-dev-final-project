import React, { useState } from 'react';
import { Link } from "react-router-dom";

import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import {createCategory} from "./apiAdmin";


const AddCategory = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const {user, token} = isAuthenticated();

    const handleChange = e => {
        setError(false);
        setSuccess(false);
        setName(e.target.value)
    };

    const clickSubmit = e => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        createCategory(user._id, token, {name})
            .then( data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setError(false);
                    setSuccess(true)
                }
            })
    };

    const showSuccess = () => {
        if (success) {
            let tempName = name;
            setName('');
            return <h4 className='text-success'>Category {tempName} created</h4>
        }
    };

    const showError = () => {
        if (error) {
            return <h4 className='text-danger'>Cannot create {name}. Category name must be unique</h4>
        }
    };

    const goBack = () => (
        <div className='mt-2'>
            <Link to='/admin/dashboard' className='text-warning'>Back to Dashboard</Link>
        </div>
    );

    const newCategoryForm = () => (
        <form onSubmit={clickSubmit}>
            <div className='form-group'>
                <label className='text-muted'>Category Name</label>
                <input type='text' onChange={handleChange} className='form-control' value={name} autoFocus/>
            </div>
            <button className='btn btn-primary'>Create Category</button>
            {goBack()}
        </form>
    );

    return (
        <Layout title='Add a Category' description="Create a new product category">
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    {showSuccess()}
                    {showError()}
                    {newCategoryForm()}
                </div>
            </div>
        </Layout>
    )
};

export default AddCategory;