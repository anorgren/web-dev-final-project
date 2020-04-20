const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {errorHandler} = require('../helpers/dbErrorHandlers');
require('dotenv').config();


exports.signup = (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
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
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with specified email does not exist.'
            })
        }
        // authenticate user; email and password match
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match."
            })
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        res.cookie('t', token, {expire: new Date() + 9999});
        const {_id, name, email, role } = user;
        res.status(200).json({token, user: {_id, email, name, role}})
    })
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    return res.status(200).json({message: "Successfully signed out"})
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});