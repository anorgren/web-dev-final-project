const Auth = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {errorHandler} = require('../helpers/dbErrorHandlers');
require('dotenv').config();

const JWT_SECRET="default";

exports.signup = (req, res) => {
    console.log(req.body);
    const user = new Auth(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        user.salt = undefined;
        user.hashedPassword = undefined;
        return res.status(200).send(user)
    })
};

exports.signin = (req, res) => {
    const {email, password} = req.body;
    Auth.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Cannot log into account of provided email.'
            })
        }
        // authenticate user; email and password match
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match."
            })
        }
        const token = jwt.sign({_id: user._id}, JWT_SECRET);
        res.cookie('t', token, {expire: new Date() + 9999});
        const {_id, name, email, role } = user;
        return res.status(200).json({token, user: {_id, email, name, role}})
    })
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    return res.status(200).json({message: "Successfully signed out."})
};

// Any signed in user can access any of these resources
exports.requireSignin = expressJwt({
    secret: JWT_SECRET,
    userProperty: "auth"
});

// User must be same user to access resource
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if (!user) {
        return res.status(403).json({
            error: "Access denied."
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    // 0 is normal user, 1 is admin
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin only resource. Access denied."
        })
    }
    next();
};