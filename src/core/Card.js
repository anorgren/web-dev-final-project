import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';

import ShowImage from "./ShowImage";
import {addItem, removeItem, updateItem} from "./cartHelpers";


const Card = ({
                  product,
                  showViewButton=true,
                  showAddToCartButton=true,
                  cartUpdate=false,
                  showRemoveProductButton=false,
                  setRun=f=>f,
                  run=undefined, isProduct=false
}) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);


    const renderDescription = (description) => {
        if (description.length > 45 && !isProduct) {
            return (
                <p className="lead text-center mt-2">{description.substring(0,44) + "..."}</p>
            )
        } else {
            return <p className="text-center lead mt-2">{description}</p>
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

    const showAddToCart = (quantity) => {
        return (
            showAddToCartButton && quantity > 0 && (
                <button onClick={addToCart} className='btn btn-warning mt-2 mb-2 ml'>
                    Add to Cart
                </button>))
    };

    const showRemoveButton = (showRemoveProductButton) => {
        return (
            showRemoveProductButton && (
                <button
                    onClick={() => {
                        removeItem(product._id);
                        setRun(!run); // run useEffect in parent Cart
                    }}
                    className="btn btn-danger mt-2 mb-2"
                >
                    Remove Product
                </button>
            )
        );
    };

    const shouldRedirect = redirect => {
        if (redirect) {
            return <Redirect to='/cart'/>
        }
    };

    const showStock = (quantity) => {
        return quantity > 0 ? <span className='badge badge-primary badge-pill'>In stock</span>
            : <span className='badge badge-danger badge-pill'>Out of stock</span>
    };

    const handleChange = (productId) => event => {
        setRun(!run);
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if (event.target.value >= 1) {
            updateItem(productId, event.target.value);
        }
    };

    const showCartUpdateOptions = cartUpdate => {
        return (
            cartUpdate && (
                <div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Adjust Quantity</span>
                        </div>
                        <input type="number"
                               className="form-control"
                               value={count}
                               onChange={handleChange(product._id)} />
                    </div>
                </div>
            )
        );
    };

    return (
            <div className='card mt-1 mb-2'>
                {shouldRedirect(redirect)}
                <div className='card-header name d-flex justify-content-between'>
                    {product.name}{showStock(product.quantity)}
                </div>
                <div className='card-body'>
                    <ShowImage product={product} url="product"/>
                    {renderDescription(product.description)}
                    <p className='black-10'>
                        ${product.price} <br/>
                        Category: {product.category && product.category.name}
                    </p>
                    <div className='text-center'>
                        {showCartUpdateOptions(cartUpdate)}
                        {showView(showViewButton)}
                        {showAddToCart(product.quantity)}
                        {showRemoveButton(showRemoveProductButton)}
                    </div>
                </div>
            </div>
    )
};

export default Card;