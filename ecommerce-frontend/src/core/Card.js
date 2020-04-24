import React from 'react';
import {Link} from 'react-router-dom';

import ShowImage from "./ShowImage";


const Card = ({product}) => {
    const renderDescription = (description) => {
        if (description.length > 100) {
            return (
                <p>{description.substring(0,100) + "..."}</p>
            )
        } else {
            return <p>{description}</p>
        }
    };

    return (
        <div className='col-4 mb-3'>
            <div className='card'>
                <div className='card-header'>{product.name}</div>
                <div className='card-body'>
                    <ShowImage product={product} url="product"/>
                    {renderDescription(product.description)}
                    <p>${product.price}</p>
                    <Link to={`/product/${product._id}`}>
                        <button className='btn btn-outline-primary mt-2 mb-2 mr-2'>
                            View Product
                        </button>
                    </Link>
                    <button className='btn btn-outline-warning mt-2 mb-2'>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Card;