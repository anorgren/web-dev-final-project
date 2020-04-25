import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Home from "./core/Home";
import Shop from "./core/Shop";
import Dashboard from "./user/UserDashboard";
import Profile from "./user/Profile";
import PrivateRoute from "./auth/PrivateRoute";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./user/AdminDashboard";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";
import Orders from "./admin/Orders";
import Product from "./core/Product";
import Cart from "./core/Cart";
import UpdateProduct from "./admin/UpdateProduct";
import AddUser from "./admin/AddUser";


const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/signin' exact component={Signin}/>
                <Route path='/signup' exact component={Signup}/>
                <Route path='/' exact component={Home}/>
                <Route path='/shop' exact component={Shop}/>
                <Route path='/product/:productId' exact component={Product}/>
                <Route path='/cart' exact component={Cart}/>
                <PrivateRoute path='/profile/:userId' exact component={Profile}/>
                <PrivateRoute path='/user/dashboard' exact component={Dashboard}/>
                <AdminRoute path='/admin/dashboard' exact component={AdminDashboard}/>
                <AdminRoute path='/admin/products' exact component={ManageProducts}/>
                <AdminRoute path='/create/category' exact component={AddCategory}/>
                <AdminRoute path='/create/product' exact component={AddProduct}/>
                <AdminRoute path='/admin/product/update/:productId' exact component={UpdateProduct}/>
                <AdminRoute path='/admin/orders' exact component={Orders}/>
                <AdminRoute path='/admin/users/new' exact component={AddUser}/>
            </Switch>
        </BrowserRouter>
    )
};

export default Routes;