exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required.').notEmpty();
    req.check('email', 'Email is required')
        .matches(/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/)
        .withMessage('Email address not a valid email');
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({min: 6})
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    const errors = req.validationErrors();
    if(errors) {
        const firstError = errors.map( error => error.msg)[0];
        return res.status(400).json({error: firstError})
    }
    next();
}