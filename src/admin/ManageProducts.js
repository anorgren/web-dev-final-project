import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";

import Layout from "../core/Layout";
import { getProducts, deleteProduct } from "./apiAdmin";
import { isAuthenticated } from "../auth";


const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const {user, token} = isAuthenticated();

    const loadProducts = () => {
        getProducts().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setProducts(data)
            }
        })
    };

    const destroyProduct = (productId) => {
        deleteProduct(productId, user._id, token)
            .then( data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    loadProducts();
                }
            })
    };

    useEffect(() => {
        loadProducts()
    }, []);

    return (
        <Layout title="Manage Products" description="Create, update, and delete products" className='container-fluid'>
            <table class='table'>
                <thead>
                    <tr>
                        <th scope='col'>Product</th>
                        <th scope='col'>Update</th>
                        <th scope='col'>Delete</th>
                    </tr>
                </thead>
                <tbody>
                {products.map((product, index) => (
                    <tr>
                        <th scope='row'>{product.name}</th>
                        <td>
                            <Link to={`/admin/product/update/${product._id}`}>
                                <span className='badge badge-warning badge-pill'>Update</span>
                            </Link>
                        </td>
                        <td>
                            <span onClick={() => destroyProduct(product._id)}
                                  className='badge badge-danger badge-pill'>
                                Delete
                            </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    )
};

export default ManageProducts;