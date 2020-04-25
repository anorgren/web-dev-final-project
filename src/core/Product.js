import React, {useEffect, useState} from 'react';

import Layout from './Layout'
import { read, listRelated } from "./apiCore";
import Card from "./Card";


const Product = (props) => {
    const [product, setProduct] = useState({});
    const [error, setError] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);

    const loadSingleProduct = productId => {
        read(productId).then((data) => {
            if(data.error) {
                setError(data.error)
            } else {
                setProduct(data)
                listRelated(data._id).then(res => {
                    if (res.error) {
                        setError(res.error)
                    } else {
                        setRelatedProduct(res);
                    }
                })
            }
        })
    };

    useEffect(() => {
        const productId = props.match.params.productId;
        loadSingleProduct(productId);
    }, [props]);

    return (
        <Layout title={product && product.name}
                description={product && product.description && product.description.substring(0, 100)}
                className={'container-fluid'}>
            <div className='row ml-3 mr-3'>
                <div className='col-xs-16 col-sm-16 col-md-8'>
                    <h3 className='mb-2 mt-3'>{product.name}</h3>
                    {product && product.description && <Card product={product} showViewButton={false}/>}
                </div>
                <div className='col-xs-16 col-sm-16 col-md-4'>
                    <h3 className='mb-2 mt-3'>Related Products:</h3>
                    {relatedProduct.map((prod, index) => (
                        <Card key={index} product={prod}/>
                    ))}
                </div>
            </div>
        </Layout>
    )
};

export default Product;