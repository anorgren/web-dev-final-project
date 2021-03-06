import React, { useState, useEffect } from 'react';

import Layout from "./Layout";
import Card from "./Card";
import { getCategories } from "../admin/apiAdmin";
import { getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./FixedPrices";

const Shop = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [myFilters, setMyFilters] = useState({
        filters: {category: [], price: []}
    });
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [filteredResults, setFilteredResults] = useState([]);

    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setError(data.error)
            } else {
                setCategories(data)
            }
        })
    };

    useEffect(() => {
        init();
        loadFilteredResults(skip, limit, myFilters.filters)
    }, []);

    const loadFilteredResults = newFilters => {
        getFilteredProducts(skip, limit, newFilters).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setFilteredResults(data.data);
                setSize(data.size);
                setSkip(0);
            }
        });
    };

    const loadMore = newFilters => {
        let toSkip = skip + limit;
        getFilteredProducts(toSkip, limit, myFilters.filters).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setFilteredResults([...filteredResults, ...data.data]);
                setSize(data.size);
                setSkip(0);
            }
        });
    };

    const loadMoreButton = () => {
        return (
            size > 0 &&
            size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        );
    };


    const handlePrice = (value) => {
        const data = prices;
        let array = [];
        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array
            }
        }
        return array;
    };

    const handleFilters = (filters, filterBy) => {
        const newFilters = {...myFilters};
        newFilters.filters[filterBy] = filters;

        if (filterBy === "price") {
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;

        }
        loadFilteredResults(myFilters.filters);
        setMyFilters(newFilters);
    };

    return (
        <Layout title="Shop Our Courses" description="Search and find the course of your choice"
                className={'container-fluid'}>
            <div className='row'>
                <div className='col-xs-16 col-sm-16 col-md-3'>
                    <h3 className='mb-4'>Filters:</h3>
                    <h5>Category:</h5>
                    <ul>
                        <Checkbox categories={categories} handleFilters={filters => handleFilters(filters, 'category')}/>
                    </ul>
                    <h5>Prices:</h5>
                    <div>
                        <RadioBox prices={prices} handleFilters={filters => handleFilters(filters, 'price')}/>
                    </div>
                </div>
                <div className='col-xs-16 col-md-9'>
                    <h3 className='mb-2'>Courses</h3>
                    <div className='row'>
                        {filteredResults.map((product, index) => (
                            <div key={index} className='col-xs-8 col-md-4 mb-3'>
                                <Card showViewButton={true} product={product}/>
                            </div>
                        ))}
                    </div>
                    <hr/>
                    <div className='text-center'>
                        {loadMoreButton()}
                    </div>
                </div>
            </div>
        </Layout>
    )
};

export default Shop;
