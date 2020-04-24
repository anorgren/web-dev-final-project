import React, {useEffect, useState} from 'react';

import {getCategories} from "../admin/apiAdmin";
import {list} from "./apiCore";
import Card from "./Card";


const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false
    });

    const {categories, category, search, results, searched} = data;

    const loadCategories = () => {
        getCategories()
            .then(values => {
                if (values.error) {
                    console.log(values.error)
                } else {
                    setData({...data, categories: values})
                }
            }
        )
    };

    useEffect(() => {
        loadCategories()
    }, []);

    const searchData = () => {
        console.log(search, category);
        if (search) {
            list({ search: search || undefined, category: category }).then(
                response => {
                    if (response.error) {
                        console.log(response.error);
                    } else {
                        setData({ ...data, results: response, searched: true });
                    }
                }
            );
        }
    };

    const searchSubmit = (event) => {
        event.preventDefault();
        searchData()

    };

    const handleChange = name => event => {
        setData({ ...data, [name]: event.target.value, searched: false });
    };

    const searchMessage = (searched, results) => {
        if (searched && results.length > 0) {
            return `Found ${results.length} products`
        }
        if (searched && results.length < 1) {
            return `No courses found.`
        }
    };

    const searchedProducts = (results = []) => {
        return (
            <div>
                <h4>{searchMessage(searched, results)}</h4>
                <div className='row'>
                    {results.map((product, index) => (<Card key={index} product={product}/>))}
                </div>
            </div>
        )
    }

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className='input-group-text'>
                <div className='input-group input-group-lg'>
                    <div className='input-group-prepend'>
                        <select className='btn mr-2' onChange={handleChange('category')}>
                            <option value='All'>All</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat._id}>
                                    {cat.name}
                                </option>))}
                        </select>
                    </div>
                    <input type='search'
                           className='form-control'
                           onChange={handleChange('search')}
                           placeholder='Search courses by name'
                    />
                </div>
                <div className='btn input-group-append' style={{border:'none'}}>
                    <button className='input-group-text'>Search</button>
                </div>
            </span>
        </form>
    );

    return (
        <div className='row'>
            <div className='container mb-3'>
                {searchForm()}
            </div>
            <div className='container-fluid mb-3'>
                {searchedProducts(results)}
            </div>
        </div>
    )
};

export default Search;