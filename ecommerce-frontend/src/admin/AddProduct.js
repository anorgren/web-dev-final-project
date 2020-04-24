import React, { useState, useEffect } from 'react';

import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createProduct, getCategories } from "./apiAdmin";

const AddProduct = () => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    });

    const {user, token} = isAuthenticated();
    const { name, description, price, categories, category, shipping, quantity,
        loading, error, createdProduct, redirectToProfile, formData } = values;

    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, categories: data, formData: new FormData()})
            }
        })
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({...values, [name]: value})
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error:'', loading:true});
        createProduct(user._id, token, formData)
            .then( data => {
                if (data.error) {
                    setValues({...values, error: data.error})
                } else {
                    setValues({
                        ...values, name:'', description: "", photo: "", price: '', quantity: '',
                        loading: false, createdProduct: data.name
                    })
                }
            })
    };

    const newPostForm = () => (
        <form className='mb-3' onSubmit={clickSubmit}>
            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input type='text' className='form-control' value={name} onChange={handleChange('name')}/>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Description</label>
                <textarea className='form-control' value={description} onChange={handleChange('description')}/>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Price</label>
                <input type='number' className='form-control' value={price} onChange={handleChange('price')}/>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Category</label>
                <select className='form-control' value={category} onChange={handleChange('category')}>
                    <option>Please select a category</option>
                    {categories && categories.map((category, index) =>
                        (<option key={index} value={category._id}>{category.name}</option>))}
                </select>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Quantity</label>
                <input type='text' className='form-control' value={quantity} onChange={handleChange('quantity')}/>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Shipping</label>
                <select className='form-control' value={category} onChange={handleChange('shipping')}>
                    <option>Is Shippable?</option>
                    <option value='1'>Yes</option>
                    <option value='0'>No</option>
                </select>
            </div>
            <label className='text-muted'>Image</label>
            <div className='form-group'>
                <label className='btn btn-secondary'>
                    <input type='file' name='photo' accept='image/*' onChange={handleChange('photo')}/>
                </label>
            </div>
            <button className='btn btn-outline-primary'>Create Product</button>
        </form>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}> {error} </div>
    );

    const showSuccess = () => (
        <div className='alert alert-info' style={{display: createdProduct ? '' : 'none'}}>
            <h4>{`Created new product ${createdProduct}`}</h4>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <Layout title='Add a Product' description="Create a new product for sale">
            <div className='row'>
                <div className='col-md-8 offset-md-2 mr-3 ml-3'>
                    {showError()}
                    {showLoading()}
                    {showSuccess()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    )
};

export default AddProduct;