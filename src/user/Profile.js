import React, {useEffect, useState} from 'react';
import { Redirect } from "react-router-dom";

import { read, update, updateUser } from './apiUser';
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";



const Profile = (props) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        error: false,
        success: false
    });
    const {token} = isAuthenticated();
    const {name, email, error, success} = values;

    const init = (userId) => {
        read(userId, token)
            .then(res => {
                if (res.error) {
                    setValues({...values, error: true})
                } else {
                    setValues({...values, name: res.name, email: res.email})
                }
            })
    };

    useEffect(() => {
        init(props.match.params.userId);
    }, []);

    const handleChange = name => (event) => {
        setValues({...values, error: false, [name]: event.target.value})
    };

    const clickSubmit = e => {
        e.preventDefault();
        update(props.match.params.userId, token, { name, email }).then(data => {
            if (data.error) {
                // console.log(data.error);
                alert(data.error);
            } else {
                updateUser(data, () => {
                    setValues({
                        ...values,
                        name: data.name,
                        email: data.email,
                        success: true
                    });
                });
            }
        });
    };

    const redirectUser = success => {
        if (success) {
            return <Redirect to="/user/dashboard"/>
        }
    };

    const profileUpdate = (name, email) => (
        <form className='form ml-2 mr-2'>
            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input className='form-control' type='text' onChange={handleChange('name')} value={name}/>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Email</label>
                <input className='form-control' type='email' onChange={handleChange('email')} value={email}/>
            </div>
            <button className='btn btn-primary' onClick={clickSubmit}>Submit</button>
        </form>
    );

    return (
        <Layout title="My Profile" description="View and edit profile" className={'container-fluid'}>
            <h4 className='ml-2 mr-2'>Update Profile</h4>
            {profileUpdate(name, email)}
            {redirectUser(success)}
        </Layout>
    )
};

export default Profile;