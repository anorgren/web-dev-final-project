import React, { useState, useEffect } from 'react';
import {Redirect} from 'react-router-dom';

import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";

const UpdateProduct = ({match}) => {
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
    const { name, description, price, categories, category, quantity,
        loading, error, createdProduct, formData, redirectToProfile } = values;

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({categories: data, formData: new FormData()})
            }
        });
    };

    const init = (productId) => {
        getProduct(productId)
            .then(data => {
                if (data.error) {
                    setValues({...values, error: data.error})
                } else {
                    setValues({...values,
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        category: data.category._id,
                        shipping: data.shipping,
                        quantity: data.quantity,
                        formData: new FormData()
                    });
                    initCategories()
                }
            })
    };

    useEffect(() => {
        init(match.params.productId);
    }, []);

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({...values, [name]: value})
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error:'', loading:true});
        updateProduct(match.params.productId, user._id, token, formData)
            .then( data => {
                if (data.error) {
                    setValues({...values, error: data.error})
                } else {
                    setValues({
                        ...values, name:'', description: "", photo: "", price: '', quantity: '',
                        loading: false, createdProduct: data.name, redirectToProfile: true
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
                <label className='text-muted'>Quantity</label>
                <input type='text' className='form-control' value={quantity} onChange={handleChange('quantity')}/>
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
            <button className='btn btn-outline-primary'>Update Product</button>
        </form>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}> {error} </div>
    );

    const showSuccess = () => (
        <div className='alert alert-info' style={{display: createdProduct ? '' : 'none'}}>
            <h4>{`${createdProduct} is updated!`}</h4>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    const redirectUser = () => {
        if(redirectToProfile) {
            if (!error) {
                return <Redirect to="/admin/products"/>
            }
        }
    };

    return (
        <Layout title='Update a Product' description="Update existing product" className='container-fluid'>
            <div className='row'>
                <div className='col-md-8 offset-md-2 mr-3 ml-3'>
                    {showError()}
                    {showLoading()}
                    {showSuccess()}
                    {newPostForm()}
                    {redirectUser()}
                </div>
            </div>
        </Layout>
    )
};

export default UpdateProduct;