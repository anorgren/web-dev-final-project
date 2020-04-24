import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import moment from 'moment';

import ShowImage from "./ShowImage";
import {addItem, removeItem, updateItem} from "./cartHelpers";


const Card = ({
                  product,
                  showViewButton=true,
                  showAddToCartButton=true,
                  cartUpdate=false,
                  showRemoveProductButton=false,
                  setRun=f=>f,
                  run=undefined
}) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);


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

    const showAddToCart = () => {
        return (
            showAddToCartButton && (
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
            : <span className='badge badge-dark badge-pill'>Out of stock</span>
    };

    const handleChange = (productId) => event => {
        setRun(!run);
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if (event.target.value >= 1) {
            updateItem(productId, event.target.value)
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
                        {showRemoveButton(showRemoveProductButton)}
                        {showCartUpdateOptions(cartUpdate)}
                    </div>
                </div>
            </div>
    )
};

export default Card;