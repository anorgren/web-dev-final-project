import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { signout, isAuthenticated } from "../auth";
import {itemTotal} from "./cartHelpers";

const isActive = (history, path) => {
    if(history.location.pathname === path) {
        return {color: '#ff9900'}
    }
    return {color: '#000000'}
};

const Menu = ({history}) => (
    <nav className='nav flex-column flex-sm-row'>
        <Link className="nav-link" to="/" style={{color: 'navy'}}>Coursify</Link>
        <Link className="nav-link" to="/shop" style={isActive(history, '/shop')}>Shop</Link>
        <Link className="nav-link" to="/cart" style={isActive(history, '/cart')}>
            Cart &nbsp;
            <sup><small className='cart-badge'>
                {itemTotal()}
            </small></sup>
        </Link>
        {!isAuthenticated() && (
            <Fragment>
                    <Link className="nav-link ml-auto" to="/signin" style={isActive(history, '/signin')}>Sign In</Link>
                    <Link className="nav-link float-right" to="/signup" style={isActive(history, '/signup')}>Sign Up</Link>
            </Fragment>
        )}
        {isAuthenticated() && isAuthenticated().user.role === 0 && (
            <Fragment>
                <Link className="nav-link" to="/user/dashboard"
                      style={isActive(history, '/user/dashboard')}>
                    Dashboard
                </Link>
            </Fragment>
        )}
        {isAuthenticated() && isAuthenticated().user.role === 1 && (
            <Fragment>
                <Link className="nav-link"
                      to="/admin/dashboard"
                      style={isActive(history, '/admin/dashboard')}
                >
                    Dashboard
                </Link>
            </Fragment>
        )}
        {isAuthenticated() &&(
            <Fragment>
                <li className='nav-item ml-auto'>
                        <span className="nav-link"
                              onClick={() => signout(() => {
                                  history.push('/')})}
                              style={{cursor: 'pointer', color: '#000000'}}>
                            Sign Out
                        </span>
                </li>
            </Fragment>
        )}
    </nav>
    // <div>
    //     <ul className="nav nav-tabs bg-white nav-fill">
    //         <Fragment>
    //             <li className='nav-item'>
    //                 <Link className="nav-link" to="/" style={{color: 'navy'}}>Coursify</Link>
    //             </li>
    //             <li className='nav-item'>
    //                 <Link className="nav-link" to="/shop" style={isActive(history, '/shop')}>Shop</Link>
    //             </li>
    //             <li className='nav-item'>
    //                 <Link className="nav-link" to="/cart" style={isActive(history, '/cart')}>
    //                     Cart &nbsp;
    //                     <sup><small className='cart-badge'>
    //                         {itemTotal()}
    //                     </small></sup>
    //                 </Link>
    //             </li>
    //         </Fragment>
    //         {!isAuthenticated() && (
    //             <Fragment>
    //                 <li className='nav-item'>
    //                     <Link className="nav-link" to="/signin" style={isActive(history, '/signin')}>Sign In</Link>
    //                 </li>
    //                 <li className='nav-item'>
    //                     <Link className="nav-link" to="/signup" style={isActive(history, '/signup')}>Sign Up</Link>
    //                 </li>
    //             </Fragment>
    //         )}
    //         {isAuthenticated() && isAuthenticated().user.role === 0 && (
    //             <li className='nav-item'>
    //                 <Link className="nav-link"
    //                       to="/user/dashboard"
    //                       style={isActive(history, '/user/dashboard')}
    //                 >
    //                     Dashboard
    //                 </Link>
    //             </li>
    //         )}
    //         {isAuthenticated() && isAuthenticated().user.role === 1 && (
    //             <li className='nav-item'>
    //                 <Link className="nav-link"
    //                       to="/admin/dashboard"
    //                       style={isActive(history, '/admin/dashboard')}
    //                 >
    //                     Dashboard
    //                 </Link>
    //             </li>
    //         )}
    //         {isAuthenticated() &&(
    //             <Fragment>
    //                 <li className='nav-item '>
    //                     <span className="nav-link"
    //                           onClick={() => signout(() => {
    //                               history.push('/')})}
    //                           style={{cursor: 'pointer', color: '#000000'}}>
    //                         Sign Out
    //                     </span>
    //                 </li>
    //             </Fragment>
    //         )}
    //     </ul>
    // </div>
);

export default withRouter(Menu);