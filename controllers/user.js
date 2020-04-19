const User = require('../models/user');
const {errorHandler} = require('../helpers/dbErrorHandlers');

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