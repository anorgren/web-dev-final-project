const express = require('express');
const router = express.Router();

const { userSignupValidator } = require('../validators');
const { signup, signin, signout, requireSignin } = require('../controllers/auth');

router.post('/signup', userSignupValidator, signup);

router.post('/signin', signin);

router.get('/signout', signout);

router.get('/help', requireSignin, (req, res) => {
    res.send("Protected route")
});

module.exports = router;