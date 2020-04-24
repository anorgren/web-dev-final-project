import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import moment from 'moment';

import ShowImage from "./ShowImage";
import { addItem } from "./cartHelpers";


const Card = ({product, showViewButton=true}) => {
    const [redirect, setRedirect] = useState(false);

    const renderDescription = (description) => {
        if (description.length > 100) {
            return (
                <p className="lead mt-2">{description.substring(0,100) + "..."}</p>
            )
        } else {
            return <p className="lead mt-2">{description}</p>
        }
    };

    const showView = (showViewButton) => {
        return (
            showViewButton && (
                <Link to={`/product/${product._id}`}>
                    <button className='btn btn-primary mt-2 mb-2 mr-1'>
                        View
                    </button>
                </Link>
            )
        )
    };

    const addToCart = () => {
        addItem(product, () => {
            setRedirect(true);
        })
    };

    const showAddToCart = () => (
        <button onClick={addToCart} className='btn btn-warning mt-2 mb-2 ml'>
            Add to Cart
        </button>
    );

    const shouldRedirect = redirect => {
        if (redirect) {
            return <Redirect to='/cart'/>
        }
    };

    const showStock = (quantity) => {
        return quantity > 0 ? <span className='badge badge-primary badge-pill'>In stock</span>
            : <span className='badge badge-dark badge-pill'>Out of stock</span>
    };

    return (
            <div className='card'>
                {shouldRedirect(redirect)}
                <div className='card-header name'>{product.name}</div>
                <div className='card-body'>
                    <ShowImage product={product} url="product"/>
                    {renderDescription(product.description)}
                    <p className='black-10'>${product.price}</p>
                    <p className='black-9'>Category: {product.category && product.category.name}</p>
                    <p className='black-8'>Added {moment(product.createdAt).fromNow}</p>
                    <div className='text-center'>
                        {showView(showViewButton)}
                        {showAddToCart()}
                        <br/>
                        {showStock(product.quantity)}
                    </div>
                </div>
            </div>
    )
};

export default Card;