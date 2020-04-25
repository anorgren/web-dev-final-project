import React, {useState} from 'react';

import Layout from "../core/Layout";
import {signup} from "../auth";


const AddUser = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: '',
        passwordVerify: '',
        role: 0,
        error: "",
        success: false
    });

    const {name, email, password, passwordVerify, success, error, role} = values;

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value })
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: false});
        signup({name, email, password, role, passwordVerify}).then( data => {
            if(password !== passwordVerify) {
                setValues({...values, error: "Passwords do not match", success: false})
            } else if (data.error) {
                setValues({...values, error: data.error, success: false})
            } else {
                setValues({...values, name:"", email:"", password:"",
                    passwordVerify:"", role: 0, success: true })
            }
        })
    };

    const signUpForm = () => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input onChange={handleChange('name')} type='text' className="form-control" value={name}/>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Email</label>
                <input onChange={handleChange('email')} type='email' className="form-control" value={email}/>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Role</label>
                <select className='form-control' value={role} onChange={handleChange('role')}>
                    <option>Please select a category</option>
                    <option value={0}>Normal User</option>
                    <option value={1}>Admin User</option>
                </select>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Password</label>
                <input onChange={handleChange('password')}
                       type='password'
                       className="form-control"
                       value={password}/>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Verify Password</label>
                <input onChange={handleChange('passwordVerify')}
                       type='password'
                       className="form-control"
                       value={passwordVerify}/>
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '': 'none'}}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className='alert alert-info' style={{display: success ? '': 'none'}}>
            Successfully created new account.
        </div>
    );

    return (
        <Layout title="Create A New User"
                description="Add a user account to the system"
                className="container col-md-8 offset-md-2"
        >
            {showError()}
            {showSuccess()}
            {signUpForm()}
        </Layout>
    )

};

export default AddUser;