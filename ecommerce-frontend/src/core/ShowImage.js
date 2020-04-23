import React from 'react';

import { API } from "../config";


const ShowImage = ({product, url}) => (
    <div className="product-image">
        <img src={`${API}/${url}/photo/${product._id}`}
             alt={product.name}
             className="mb-3"
             style={{ maxHeight: "100%", maxWidth: "100%" }}
        />
    </div>
);

export default ShowImage;

